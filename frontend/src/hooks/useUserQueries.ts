import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    signup,
    login,
    logout,
    getUserInfo,
    changeName,
    changePassword,
    sendVerificationCode,
    verifyVerificationCode,
    sendForgotPasswordCode,
    verifyForgotPasswordCode,
} from "@/lib/user.api";
import type {
    SignupData,
    LoginData,
    ChangeNameData,
    ChangePasswordData,
    VerificationCodeData,
    ForgotPasswordData,
} from "../types/types";
import { toast } from "react-hot-toast";

// -------------------- Get User Info --------------------
export const useUserInfo = () => {
    return useQuery({
        queryKey: ["userInfo"],
        queryFn: getUserInfo,
        staleTime: 1000 * 60 * 5, // 5 min
        retry: (failureCount, error: any) => {
            // Don't retry on 401 (Unauthorized)
            if (error?.response?.status === 401) {
                return false;
            }
            return failureCount < 3;
        },
    });
};

// -------------------- Signup/Login/Logout --------------------
export const useSignup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SignupData) => signup(data),
        onSuccess: () => {
            toast.success("Account created successfully!");
            queryClient.invalidateQueries({ queryKey: ["userInfo"] });
        },
        onError: (err: any) => {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Signup failed. Please try again.";
            toast.error(message);
        },
    });
};

export const useLogin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: LoginData) => login(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userInfo"] });
        },
        onError: (err: any) => {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Login failed. Please try again.";
            toast.error(message);
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            // Clear all queries from cache
            queryClient.clear();
            toast.success("Logged out successfully!");
        },
        onError: (err: any) => {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Logout failed. Please try again.";
            toast.error(message);
            // Still clear cache even if API call fails
            queryClient.clear();
        },
    });
};

// -------------------- Change Info --------------------
export const useChangeName = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ChangeNameData) => changeName(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userInfo"] });
            toast.success("Name updated successfully!");
        },
        onError: (err: any) => {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to update name. Please try again.";
            toast.error(message);
        },
    });
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: (data: ChangePasswordData) => changePassword(data),
        onSuccess: () => {
            toast.success("Password changed successfully!");
        },
        onError: (err: any) => {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to change password. Please try again.";
            toast.error(message);
        },
    });
};

// -------------------- Verification Code --------------------
export const useSendVerificationCode = () => {
    return useMutation({
        mutationFn: (email: string) => sendVerificationCode(email),
        onSuccess: () => {
            toast.success("Verification code sent successfully!");
        },
        onError: (err: any) => {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to send verification code. Please try again.";
            toast.error(message);
        },
    });
};

export const useVerifyVerificationCode = () => {
    return useMutation({
        mutationFn: (data: VerificationCodeData) => verifyVerificationCode(data),
        onSuccess: () => {
            toast.success("Email verified successfully!");
        },
        onError: (err: any) => {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to verify code. Please try again.";
            toast.error(message);
        },
    });
};

// -------------------- Forgot Password --------------------
export const useSendForgotPasswordCode = () => {
    return useMutation({
        mutationFn: (email: string) => sendForgotPasswordCode(email),
        onSuccess: () => {
            toast.success("Password reset code sent to your email!");
        },
        onError: (err: any) => {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to send reset code. Please try again.";
            toast.error(message);
        },
    });
};

export const useVerifyForgotPasswordCode = () => {
    return useMutation({
        mutationFn: (data: ForgotPasswordData) => verifyForgotPasswordCode(data),
        onSuccess: () => {
            toast.success("Password reset successfully!");
        },
        onError: (err: any) => {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to reset password. Please try again.";
            toast.error(message);
        },
    });
};