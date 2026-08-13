import express from "express";
import {
    changeFirstNameLastName,
    changePassword,
    getUserInfo,
    login,
    logout,
    sendForgotPasswordCode,
    sendVerificationCode,
    signup,
    verifyForgotPasswordCode,
    verifyVerificationCode
} from "../controllers/auth.controller.js";
import { authenticationMiddleware, ensureAuthenticated } from "../middlewares/auth.middleware.js";
import rateLimit from "express-rate-limit";

// Rate limiting configurations
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 5 requests per windowMs
    message: {
        success: false,
        error: "Too many authentication attempts, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
    trustProxy: 1, // Trust first proxy
});

const verificationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 3 requests per windowMs
    message: {
        success: false,
        error: "Too many verification attempts, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
    trustProxy: 1, // Trust first proxy
});

const router = express.Router();

// Public routes
router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.patch("/send-verification-code", verificationLimiter, sendVerificationCode);
router.patch("/verify-verification-code", verificationLimiter, verifyVerificationCode);
router.patch("/send-forgot-password-code", verificationLimiter, sendForgotPasswordCode);
router.patch("/verify-forgot-password-code", verificationLimiter, verifyForgotPasswordCode);

// Protected routes (require authentication)
router.post("/logout", authenticationMiddleware, ensureAuthenticated, logout);
router.patch("/change-password", authenticationMiddleware, ensureAuthenticated, changePassword);
router.get("/me", authenticationMiddleware, ensureAuthenticated, getUserInfo);
router.patch("/change-name", authenticationMiddleware, ensureAuthenticated, changeFirstNameLastName);

export default router;