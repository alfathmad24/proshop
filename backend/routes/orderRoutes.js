import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

import {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getUserOrders,
    getAllOrders,
    updateDeliverUser,
    payWithMidtrans,
    updatePayWithMidtrans,
} from "../controllers/orderController.js";

router.get("/myorders", protect, getUserOrders);
router.get("/orderlist", protect, admin, getAllOrders);
router.put("/:id/deliver", protect, admin, updateDeliverUser);
router.put("/:id/pay", protect, updateOrderToPaid);
router.put("/:id/updatepay", protect, updatePayWithMidtrans);
router.post("/:id/paymidtrans", protect, payWithMidtrans);
router.get("/:id", protect, getOrderById);
router.post("/", protect, addOrderItems);

// router.put("/profile", authProtect, updateUserProfile);

export default router;
