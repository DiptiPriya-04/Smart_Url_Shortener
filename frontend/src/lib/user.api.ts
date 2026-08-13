import { axiosInstance } from "./axios";
import type {
    SignupData,
    LoginData,
    VerificationCodeData,
    ForgotPasswordData,
    ChangePasswordData,
    ChangeNameData,
} from "../types/types";

// Helper func for error handling
const handleError = (error: any) => {
    console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Something went wrong. Please try again." };
};

// Signup and login
export const signup = async (data: SignupData) => {
    try {
        const response = await axiosInstance.post("/user/signup", data);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const login = async (data: LoginData) => {
    try {
        const response = await axiosInstance.post("/user/login", data);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// Logout (requires authentication)
export const logout = async () => {
    try {
        const response = await axiosInstance.post("/user/logout");
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// Verification code flow
export const sendVerificationCode = async (email: string) => {
    try {
        const response = await axiosInstance.patch("/user/send-verification-code", { email });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const verifyVerificationCode = async (data: VerificationCodeData) => {
    try {
        const response = await axiosInstance.patch("/user/verify-verification-code", data);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// Forgot password flow
export const sendForgotPasswordCode = async (email: string) => {
    try {
        const response = await axiosInstance.patch("/user/send-forgot-password-code", { email });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const verifyForgotPasswordCode = async (data: ForgotPasswordData) => {
    try {
        const response = await axiosInstance.patch("/user/verify-forgot-password-code", data);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// Password and name management
export const changePassword = async (data: ChangePasswordData) => {
    try {
        const response = await axiosInstance.patch("/user/change-password", data);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const changeName = async (data: ChangeNameData) => {
    try {
        const response = await axiosInstance.patch("/user/change-name", data);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// Get user info
export const getUserInfo = async () => {
    try {
        const response = await axiosInstance.get("/user/me" );
        return response.data;
    } catch (error) {
        handleError(error);
    }
};
