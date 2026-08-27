import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

export async function listOrders(req, res) {
  res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
}

export async function getOrder(req, res) {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
}

export async function listAllOrders(req, res) {
  res.json(await Order.find().populate("user", "name email").sort({ createdAt: -1 }));
}

export async function updateOrderStatus(req, res) {
  const allowed = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: "Invalid status" });
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
}
