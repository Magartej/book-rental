const express = require("express");
const {
  createAOrder,
  getOrderByEmail,
  getAllOrders,
  updateOrderStatus,
} = require("./order.controller");
const { verifyToken } = require("../middleware/auth");
const { hasPermission, PERMISSIONS } = require("../middleware/roles");

const router = express.Router();

// Create order endpoint (Authenticated users only)
router.post("/", createAOrder);

// Get orders by user email (Users can only view their own orders)
router.get("/email/:email", getOrderByEmail);

// Admin endpoints
router.get(
  "/admin/all",
  verifyToken,
  hasPermission(PERMISSIONS.MANAGE_USERS),
  getAllOrders
);
router.patch(
  "/admin/:id/status",
  verifyToken,
  hasPermission(PERMISSIONS.MANAGE_USERS),
  updateOrderStatus
);

module.exports = router;
