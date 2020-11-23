import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

import {
    authUser,
    getUserProfile,
    signupUser,
    updateUserProfile,
    getUsers,
    updateUser,
    removeUser,
    getUserById,
} from "../controllers/userController.js";

// /profile
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
// /:id
router.delete("/:id", protect, admin, removeUser);
router.get("/:id", protect, admin, getUserById);
router.put("/:id", protect, admin, updateUser);
// /login
router.post("/login", authUser);
// /
router.post("/", signupUser);
router.get("/", protect, admin, getUsers);

export default router;
