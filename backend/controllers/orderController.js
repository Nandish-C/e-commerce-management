const Order = require("../models/Order");
const User = require("../models/User");
const mongoose = require("mongoose");

// Map frontend address fields to schema fields
const buildAddress = (src = {}) => ({
  name: src.name || "Guest",
  phone: src.phone || "",
  addressLine1: src.addressLine1 || src.address || "",
  addressLine2: src.addressLine2 || "",
  city: src.city || "",
  state: src.state || "",
  pincode: src.pincode || "",
});

// Resolve a valid user id; create/find a guest user for checkout without one
const resolveUser = async (userId, contact = {}) => {
  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    const existing = await User.findById(userId);
    if (existing) return existing._id;
  }
  if (contact.email) {
    const existing = await User.findOne({ email: contact.email });
    if (existing) return existing._id;
  }
  const created = await User.create({
    name: contact.name || "Guest",
    email: contact.email || "",
    phone: contact.phone || "",
  });
  return created._id;
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user products.product");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user products.product");
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get orders by user ID
exports.getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate("user products.product");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create order
exports.createOrder = async (req, res) => {
  try {
    const body = req.body || {};
    const deliveryDetails = body.deliveryDetails || {};
    const shippingSrc = deliveryDetails.shipping || body.shipping || {};
    const billingSrc = deliveryDetails.billing || body.billing || shippingSrc;

    const userId = await resolveUser(body.user, shippingSrc);

    const order = new Order({
      user: userId,
      products: body.products || [],
      total: body.total,
      paymentMethod: body.paymentMethod || "cod",
      deliveryAddress: buildAddress(body.deliveryAddress || billingSrc),
      shippingAddress: buildAddress(body.shippingAddress || shippingSrc),
      deliveryDate: body.deliveryDate || deliveryDetails.deliveryDate,
      status: body.status || "pending",
    });

    await order.save();

    const populated = await Order.findById(order._id).populate("user products.product");
    res.status(201).json({ message: "Order created successfully", data: populated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update order
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("user products.product");
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: "Order updated successfully", data: order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
