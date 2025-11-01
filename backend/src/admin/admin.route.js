const express = require("express");
const User = require("./admin.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

const router = express.Router();

// List all admins
router.get("/admins", async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select(
      "_id username email"
    );
    res.status(200).json({ admins });
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Create a new admin
router.post("/add-admin", verifyToken, verifyAdmin, async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Admin with this username or email already exists" });
    }
    const admin = new User({ username, email, password, role: "admin" });
    await admin.save();
    res.status(201).json({
      message: "Admin created successfully",
      admin: { username, email },
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete an admin
router.delete(
  "/delete-admin/:id",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const admin = await User.findById(id);
      if (!admin || admin.role !== "admin") {
        return res.status(404).json({ message: "Admin not found" });
      }
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
      console.error("Error deleting admin:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Check for JWT secret on startup
const JWT_SECRET = process.env.JWT_SECRET_KEY;
if (!JWT_SECRET) {
  console.error("WARNING: JWT_SECRET_KEY is not set in environment variables");
}

// Admin login
router.post("/admin", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Input validation
    if (!username || !password) {
      return res.status(400).json({
        message: "All fields are required",
        details: {
          username: !username ? "Username is required" : null,
          password: !password ? "Password is required" : null,
        },
      });
    }

    // Find admin by username and role
    const admin = await User.findOne({ username, role: "admin" });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password using bcrypt
    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if JWT_SECRET is set
    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not set");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // Create JWT token with admin role
    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Authentication successful",
      token: token,
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
    res
      .status(200)
      .json({ message: "Logged in successfully", user: { email: user.email } });
  });
});

// 🚪 LOGOUT ROUTE
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Logout failed");
    res.clearCookie("sessionId");
    res.status(200).send("Logged out");
  });
});

module.exports = router;
