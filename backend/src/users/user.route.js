const express = require("express");
const User = require("./user.model");
const jwt = require("jsonwebtoken");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Change password route
router.post("/change-password", async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  console.log("Change password request:", { email, oldPassword, newPassword });
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }
    user.password = newPassword;
    user.markModified("password");
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Admin login
router.post("/admin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await User.findOne({ username });
    if (!admin) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    const isValidPassword = await admin.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set the JWT token in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.status(200).json({
      message: "Authentication successful",
      user: {
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Failed to login as admin", error);
    res.status(401).send({ message: "Failed to login as admin" });
  }
});

// Verify admin token
router.get("/verify-admin", verifyToken, async (req, res) => {
  try {
    // The verifyToken middleware already checked the token validity
    // Now check if the user is an admin
    if (req.user && req.user.role === "admin") {
      return res.status(200).json({ isAdmin: true });
    } else {
      return res.status(403).json({ isAdmin: false });
    }
  } catch (error) {
    console.error("Error verifying admin token", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 🔐 LOGIN ROUTE
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  req.session.regenerate((err) => {
    if (err) return res.status(500).send("Session regeneration failed");

    req.session.userId = user._id;
    res.status(200).json({
      message: "Logged in successfully",
      user: {
        email: user.email,
        username: user.username,
        phoneNumber: user.phoneNumber || "",
      },
    });
  });
});

// 🚪 LOGOUT ROUTE
router.post("/logout", (req, res) => {
  // Clear the JWT cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  // Also clear the session if it exists
  if (req.session) {
    req.session.destroy((err) => {
      if (err) console.error("Session destruction error:", err);
    });
  }

  res.status(200).json({ message: "Logged out successfully" });
});

// 🚀 REGISTER ROUTE
router.post("/register", async (req, res) => {
  const { username, email, password, phoneNumber } = req.body;
  try {
    console.log("Register request body:", req.body);
    const user = new User({ username, email, password, phoneNumber });
    await user.save();
    console.log("User saved to MongoDB:", user);
    res.status(201).json({
      message: "User registered successfully",
      user: { username, email, phoneNumber },
    });
  } catch (error) {
    console.error("Failed to register user", error);
    res
      .status(400)
      .json({ message: "Failed to register user", error: error.message });
  }
});

// Check current user session
router.get("/me", async (req, res) => {
  try {
    if (req.session && req.session.userId) {
      const user = await User.findById(req.session.userId).select("-password");
      if (user) {
        return res.status(200).json({
          user: {
            email: user.email,
            username: user.username,
            phoneNumber: user.phoneNumber || "",
          },
        });
      }
    }
    return res.status(401).json({ message: "Not authenticated" });
  } catch (error) {
    console.error("Error checking session:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
