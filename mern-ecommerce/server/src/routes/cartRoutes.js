import { Router } from "express";
import { addToCart, getCart, removeFromCart, updateCartItem } from "../controllers/cartController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.get("/", getCart);
router.post("/", addToCart);
router.put("/:productId", updateCartItem);
router.delete("/:productId", removeFromCart);
export default router;
