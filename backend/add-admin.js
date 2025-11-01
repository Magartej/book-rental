const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], required: true },
});

// Add pre-save hook to hash password automatically
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Admin = mongoose.model("Admin", adminSchema);

async function addAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.DB_URL || "mongodb://localhost:27017/book-store"
    );
    console.log("Connected to MongoDB");

    // Admin credentials - CHANGE THESE!
    const adminData = {
      username: "admin",
      email: "admin@bookstore.com",
      password: "Admin@123456", // Change this password!
      role: "admin",
    };

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ username: adminData.username }, { email: adminData.email }],
    });

    if (existingAdmin) {
      console.log("❌ Admin with this username or email already exists!");
      process.exit(1);
    }

    // Create admin - password will be automatically hashed by the model's pre-save hook
    const newAdmin = new Admin({
      username: adminData.username,
      email: adminData.email,
      password: adminData.password, // Don't hash here - model will do it automatically
      role: adminData.role,
    });

    await newAdmin.save();
    console.log("✅ Admin created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Username:", adminData.username);
    console.log("Email:", adminData.email);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("⚠️  Remember to change the default credentials!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
}

addAdmin();
