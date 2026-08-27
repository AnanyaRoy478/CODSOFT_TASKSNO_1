import { Router } from "express";
import { createProduct, deleteProduct, getProduct, listProducts, updateProduct } from "../controllers/productController.js";
import { admin, protect } from "../middleware/auth.js";

const router = Router();
router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);
export default router;
