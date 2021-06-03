import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

import {
  getProducts,
  getProductById,
  removeProduct,
  createProduct,
  updatedProduct,
  createProductReview,
  getTopProducts,
} from "../controllers/productController.js";

router.post("/", protect, admin, createProduct);
router.get("/top", getTopProducts);
router.post("/:id/review", protect, createProductReview);
router.get("/:id", getProductById);
router.delete("/:id", protect, admin, removeProduct);
router.put("/:id", protect, admin, updatedProduct);
router.get("/", getProducts);

export default router;
