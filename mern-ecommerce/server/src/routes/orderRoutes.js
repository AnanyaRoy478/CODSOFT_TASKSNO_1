import { Router } from "express";
import { getOrder, listAllOrders, listOrders, updateOrderStatus } from "../controllers/orderController.js";
import { admin, protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.get("/", listOrders);
router.get("/all", admin, listAllOrders);
router.get("/:id", getOrder);
router.patch("/:id/status", admin, updateOrderStatus);
export default router;
