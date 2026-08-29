import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

async function getOrCreate(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
}

export async function getCart(req, res) {
  const cart = await getOrCreate(req.user._id);
  await cart.populate("items.product");
  res.json(cart);
}

export async function addToCart(req, res) {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });
  if (product.stock < quantity) return res.status(400).json({ message: "Not enough stock" });

  const cart = await getOrCreate(req.user._id);
  const item = cart.items.find(i => i.product.toString() === productId);
  if (item) {
    if (item.quantity + Number(quantity) > product.stock) return res.status(400).json({ message: "Not enough stock" });
    item.quantity += Number(quantity);
  } else {
    cart.items.push({ product: productId, quantity: Number(quantity) });
  }
  await cart.save();
  await cart.populate("items.product");
  res.json(cart);
}

export async function updateCartItem(req, res) {
  const quantity = Number(req.body.quantity);
  const cart = await getOrCreate(req.user._id);
  const item = cart.items.find(i => i.product.toString() === req.params.productId);
  if (!item) return res.status(404).json({ message: "Cart item not found" });

  const product = await Product.findById(req.params.productId);
  if (!product || quantity < 1 || quantity > product.stock) return res.status(400).json({ message: "Invalid quantity" });
  item.quantity = quantity;
  await cart.save();
  await cart.populate("items.product");
  res.json(cart);
}

export async function removeFromCart(req, res) {
  const cart = await getOrCreate(req.user._id);
  cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
  await cart.save();
  await cart.populate("items.product");
  res.json(cart);
}
