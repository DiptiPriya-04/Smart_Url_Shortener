import { db } from "../db/index.js";
import { usersTable } from "../models/index.js";
import {
    acceptCodeSchema,
    acceptFPCodeSchema,
    changeNameSchema,
    changePasswordSchema,
    loginBodySchema,
    signupBodySchema,
} from "../validation/request.validation.js";
import { hashPasswordWithSalt, hmacProcess, comparePasswords } from "../utils/hash.js";
import { getUserByEmail } from "../services/user.service.js";
import { createUserToken } from "../utils/token.js";
import { transport } from "../middlewares/sendMail.js";
import { eq } from "drizzle-orm";
import crypto from 'crypto';

// Helper function for consistent error responses
const errorResponse = (res, status, message) => {
    return res.status(status).json({
        success: false,
        error: message
    });
};

// Helper function for success responses
const successResponse = (res, status, message, data = null) => {
    const response = {
        success: true,
        message
    };
    if (data) response.data = data;
    return res.status(status).json(response);
};

export const signup = async (req, res) => {
    try {
        const validationResult = await signupBodySchema.safeParseAsync(req.body);
        if (!validationResult.success) {
            return errorResponse(res, 400, "Invalid input data");
        }

        const { firstname, lastname, email, password } = validationResult.data;

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return errorResponse(res, 400, `User with email ${email} already exists`);
        }

        const { salt, password: hashedPassword } = await hashPasswordWithSalt(password);

        const [user] = await db
            .insert(usersTable)
            .values({
                firstname: firstname.trim(),
                lastname: lastname.trim(),
                email: email.toLowerCase().trim(),
                password: hashedPassword,
                salt,
            })
            .returning({
                id: usersTable.id,
                email: usersTable.email,
            });

        if (!user) {
            throw new Error("Failed to create user");
        }

        return successResponse(res, 201, `User created successfully`, {
            userId: user.id,
            email: user.email
        });
    } catch (error) {
        console.error("Signup error:", error);
        return errorResponse(res, 500, "Failed to create user");
    }
};

export const sendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return errorResponse(res, 400, "Email is required");
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Find user by email
        const [user] = await db
            .select({
                id: usersTable.id,
                email: usersTable.email,
                verified: usersTable.verified,
            })
            .from(usersTable)
            .where(eq(usersTable.email, normalizedEmail));

        if (!user) {
            return errorResponse(res, 404, `User with email ${normalizedEmail} doesn't exist`);
        }

        if (user.verified) {
            return errorResponse(res, 400, "User is already verified");
        }

        // Generate a cryptographically secure random code
        const codeValue = crypto.randomInt(100000, 999999).toString();
        const hashedCodeValue = await hmacProcess(
            codeValue,
            process.env.HMAC_VERIFICATION_CODE_SECRET
        );

        // Update user with the verification code
        await db
            .update(usersTable)
            .set({
                verificationCode: hashedCodeValue,
                verificationCodeValidation: Math.floor(Date.now() / 1000),
                updatedAt: new Date(),
            })
            .where(eq(usersTable.email, normalizedEmail));

        // Send the verification code email
        try {
            const mailOptions = {
                from: process.env.SMTP_USER,
                to: normalizedEmail,
                subject: "Your Verification Code",
                html: `
                    <div style="font-family: Arial, sans-serif; text-align: center;">
                        <h2>Your Verification Code</h2>
                        <p style="font-size: 22px; font-weight: bold;">${codeValue}</p>
                        <p>This code will expire in 5 minutes.</p>
                    </div>
                `,
            };

          const info = await transport.sendMail(mailOptions);

if (info?.messageId) {
    return successResponse(res, 200, "Verification code sent successfully");
} else {
    console.error("Email send failed:", info);
    return errorResponse(res, 500, "Failed to send verification email");
}
        } catch (emailError) {
            console.error("Email error:", emailError);
            return errorResponse(res, 500, "Failed to send verification email");
        }
    } catch (error) {
        console.error("Send verification code error:", error);
        return errorResponse(res, 500, "Internal server error");
    }
};

export const verifyVerificationCode = async (req, res) => {
    try {
        const validationResult = await acceptCodeSchema.safeParseAsync(req.body);
        if (!validationResult.success) {
            return errorResponse(res, 400, "Invalid input data");
        }

        const { email, providedCode } = validationResult.data;
        const normalizedEmail = email.toLowerCase().trim();
        const code = providedCode.toString();

        const [user] = await db
            .select({
                id: usersTable.id,
                email: usersTable.email,
                verified: usersTable.verified,
                verificationCode: usersTable.verificationCode,
                verificationCodeValidation: usersTable.verificationCodeValidation,
            })
            .from(usersTable)
            .where(eq(usersTable.email, normalizedEmail));

        if (!user) {
            return errorResponse(res, 404, `User with email ${normalizedEmail} doesn't exist`);
        }

        if (user.verified) {
            return errorResponse(res, 400, "User is already verified");
        }

        if (!user.verificationCode || !user.verificationCodeValidation) {
            return errorResponse(res, 400, "Verification code not found or invalid");
        }

        // Check expiration (5 minutes)
        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime - user.verificationCodeValidation > 300) { // 5 minutes
            return errorResponse(res, 400, "Verification code has expired");
        }

        // Verify code
        const hashedCodeValue = await hmacProcess(
            code,
            process.env.HMAC_VERIFICATION_CODE_SECRET
        );

        // Use simple comparison for now to debug
        if (hashedCodeValue !== user.verificationCode) {
            return errorResponse(res, 400, "Invalid verification code");
        }

        // Update user as verified
        await db
            .update(usersTable)
            .set({
                verified: true,
                verificationCode: null,
                verificationCodeValidation: null,
                updatedAt: new Date(),
            })
            .where(eq(usersTable.email, normalizedEmail));

        return successResponse(res, 200, "Account verified successfully");
    } catch (error) {
        console.error("Verify verification code error:", error);
        return errorResponse(res, 500, "Internal server error");
    }
};

export const login = async (req, res) => {
    try {
        const validationResult = await loginBodySchema.safeParseAsync(req.body);
        if (!validationResult.success) {
            return errorResponse(res, 400, "Invalid email or password");
        }

        const { email, password } = validationResult.data;
        const normalizedEmail = email.toLowerCase().trim();

        const user = await getUserByEmail(normalizedEmail);

        if (!user) {
            return errorResponse(res, 400, "Invalid email or password");
        }

        if (!user.verified) {
            return errorResponse(res, 403, "Please verify your email before logging in");
        }

        // Verify password with simple comparison for debugging
        const { password: computedHash } = await hashPasswordWithSalt(password, user.salt);

        if (computedHash !== user.password) {
            return errorResponse(res, 400, "Invalid email or password");
        }

        // Create JWT token
        const token = await createUserToken({
            id: user.id,
            email: user.email
        });

        // Set secure cookie
        res.cookie("Authorization", `Bearer ${token}`, {
            expires: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
            httpOnly: true,
            secure: false, // turn on for production
            sameSite: "strict",
            path: "/",
        });

    return successResponse(res, 200, "Logged in successfully", token);
    } catch (error) {
        console.error("Login error:", error);
        return errorResponse(res, 500, "Internal server error");
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("Authorization", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        return successResponse(res, 200, "Logged out successfully");
    } catch (error) {
        console.error("Logout error:", error);
        return errorResponse(res, 500, "Internal server error");
    }
};

export const changePassword = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { oldPassword, newPassword } = req.body;

        const validationResult = await changePasswordSchema.safeParseAsync({
            oldPassword,
            newPassword,
        });

        if (!validationResult.success) {
            return errorResponse(res, 400, "Invalid input data");
        }

        const [user] = await db
            .select({
                id: usersTable.id,
                password: usersTable.password,
                salt: usersTable.salt,
                verified: usersTable.verified,
            })
            .from(usersTable)
            .where(eq(usersTable.id, userId));

        if (!user) {
            return errorResponse(res, 404, "User not found");
        }

        if (!user.verified) {
            return errorResponse(res, 401, "Account not verified");
        }

        // Verify old password with simple comparison
        const { password: hashedOldPassword } = await hashPasswordWithSalt(
            oldPassword,
            user.salt
        );

        if (hashedOldPassword !== user.password) {
            return errorResponse(res, 401, "Invalid old password");
        }

        // Hash new password
        const { salt: newSalt, password: hashedNewPassword } = await hashPasswordWithSalt(newPassword);

        await db
            .update(usersTable)
            .set({
                password: hashedNewPassword,
                salt: newSalt,
                updatedAt: new Date(),
            })
            .where(eq(usersTable.id, userId));

        return successResponse(res, 200, "Password updated successfully");
    } catch (error) {
        console.error("Change password error:", error);
        return errorResponse(res, 500, "Internal server error");
    }
};

export const sendForgotPasswordCode = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return errorResponse(res, 400, "Email is required");
        }

        const normalizedEmail = email.toLowerCase().trim();

        const [user] = await db
            .select({
                id: usersTable.id,
                email: usersTable.email,
                verified: usersTable.verified,
            })
            .from(usersTable)
            .where(eq(usersTable.email, normalizedEmail));

        if (!user) {
            // Don't reveal whether user exists for security
            return successResponse(res, 200, "If the email exists, a reset code has been sent");
        }

        if (!user.verified) {
            return errorResponse(res, 400, "Account not verified");
        }

        // Generate secure random code
        const codeValue = crypto.randomInt(100000, 999999).toString();
        const hashedCodeValue = await hmacProcess(
            codeValue,
            process.env.HMAC_VERIFICATION_CODE_SECRET
        );

        await db
            .update(usersTable)
            .set({
                forgotPasswordCode: hashedCodeValue,
                forgotPasswordCodeValidation: Math.floor(Date.now() / 1000),
                updatedAt: new Date(),
            })
            .where(eq(usersTable.email, normalizedEmail));

        // Send email
        try {
            const info = await transport.sendMail({
                from: process.env.SMTP_USER,
                to: normalizedEmail,
                subject: "Password Reset Code",
                html: `
                    <div style="font-family: Arial, sans-serif; text-align: center;">
                    <h2>Password Reset Request</h2>
                    <p style="font-size: 18px;">Your password reset code is:</p>
                    <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${codeValue}</p>
                    <p>This code will expire in 5 minutes.</p>
                    </div>
                `,
            });

            if (info.accepted.includes(normalizedEmail)) {
                return successResponse(res, 200, "Password reset code sent successfully");
            } else {
                return errorResponse(res, 500, "Failed to send reset email");
            }
        } catch (emailError) {
            console.error("Email error:", emailError);
            return errorResponse(res, 500, "Failed to send reset email");
        }
    } catch (error) {
        console.error("Send forgot password code error:", error);
        return errorResponse(res, 500, "Internal server error");
    }
};

export const verifyForgotPasswordCode = async (req, res) => {
    try {
        const validationResult = await acceptFPCodeSchema.safeParseAsync(req.body);
        if (!validationResult.success) {
            return errorResponse(res, 400, "Invalid input data");
        }

        const { email, providedCode, newPassword } = validationResult.data;
        const normalizedEmail = email.toLowerCase().trim();

        const [user] = await db
            .select({
                id: usersTable.id,
                email: usersTable.email,
                forgotPasswordCode: usersTable.forgotPasswordCode,
                forgotPasswordCodeValidation: usersTable.forgotPasswordCodeValidation,
            })
            .from(usersTable)
            .where(eq(usersTable.email, normalizedEmail));

        if (!user) {
            return errorResponse(res, 404, "Invalid reset request");
        }

        if (!user.forgotPasswordCode || !user.forgotPasswordCodeValidation) {
            return errorResponse(res, 400, "No valid password reset request found");
        }

        // Check expiration
        const nowUnix = Math.floor(Date.now() / 1000);
        if (nowUnix - user.forgotPasswordCodeValidation > 300) {
            return errorResponse(res, 400, "Reset code has expired");
        }

        // Verify code with simple comparison
        const hashedProvidedCode = await hmacProcess(
            providedCode.toString(),
            process.env.HMAC_VERIFICATION_CODE_SECRET
        );

        if (hashedProvidedCode !== user.forgotPasswordCode) {
            return errorResponse(res, 400, "Invalid reset code");
        }

        // Hash new password
        const { password: hashedPassword, salt } = await hashPasswordWithSalt(newPassword);

        await db
            .update(usersTable)
            .set({
                password: hashedPassword,
                salt,
                forgotPasswordCode: null,
                forgotPasswordCodeValidation: null,
                updatedAt: new Date(),
            })
            .where(eq(usersTable.email, normalizedEmail));

        return successResponse(res, 200, "Password reset successfully");
    } catch (error) {
        console.error("Verify forgot password code error:", error);
        return errorResponse(res, 500, "Internal server error");
    }
};

export const changeFirstNameLastName = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { firstname, lastname } = req.body;

        const validationResult = await changeNameSchema.safeParseAsync({
            firstname,
            lastname,
        });

        if (!validationResult.success) {
            return errorResponse(res, 400, "Invalid input data");
        }

        const [user] = await db
            .select({
                id: usersTable.id,
            })
            .from(usersTable)
            .where(eq(usersTable.id, userId));

        if (!user) {
            return errorResponse(res, 404, "User not found");
        }

        await db
            .update(usersTable)
            .set({
                firstname: firstname.trim(),
                lastname: lastname.trim(),
                updatedAt: new Date(),
            })
            .where(eq(usersTable.id, userId));

        return successResponse(res, 200, "Name updated successfully", {
            firstname: firstname.trim(),
            lastname: lastname.trim()
        });
    } catch (error) {
        console.error("Change name error:", error);
        return errorResponse(res, 500, "Internal server error");
    }
};

export const getUserInfo = async (req, res) => {
    try {
        const { id: userId } = req.user;

        const [user] = await db
            .select({
                id: usersTable.id,
                firstname: usersTable.firstname,
                lastname: usersTable.lastname,
                email: usersTable.email,
                verified: usersTable.verified,
                role: usersTable.role,
                createdAt: usersTable.createdAt,
                updatedAt: usersTable.updatedAt,
            })
            .from(usersTable)
            .where(eq(usersTable.id, userId));

        if (!user) {
            return errorResponse(res, 404, "User not found");
        }

        return successResponse(res, 200, "User information fetched successfully", user);
    } catch (error) {
        console.error("Get user info error:", error);
        return errorResponse(res, 500, "Internal server error");
    }
};