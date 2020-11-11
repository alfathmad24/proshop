import express from "express";
import authProtect from "../middleware/authMiddleware.js";

const router = express.Router();

import {
    authUser,
    getUserProfile,
    signupUser,
    updateUserProfile,
} from "../controllers/userController.js";

router.post("/", signupUser);
router.post("/login", authUser);
router.get("/profile", authProtect, getUserProfile);
router.put("/profile", authProtect, updateUserProfile);

export default router;
