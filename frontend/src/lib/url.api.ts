import { axiosInstance } from "@/lib/axios";
import type { ShortenData } from "@/types/types";

// Helper to handle errors consistently
const handleUrlError = (error: any) => {
    const backendError =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";

    console.error("URL API Error:", backendError);
    throw new Error(backendError); // ✅ throw clean error message
};


// Create a short URL - Fixed to match backend expectations
export const createShortUrl = async (data: ShortenData) => {
    try {
        // Transform data to match backend expectations
        const payload = {
            url: data.url, // Backend expects 'url'
            ...(data.code && data.code.trim() !== '' && { code: data.code }) // Only include if provided and not empty
        };

        console.log("Sending payload to backend:", payload);

        const response = await axiosInstance.post("/shorten", payload);
        return response.data;
    } catch (error) {
        handleUrlError(error);
    }
};

// Get all created short URLs
export const getAllUserUrls = async () => {
    try {
        const response = await axiosInstance.get("/codes");
        return response.data;
    } catch (error) {
        handleUrlError(error);
    }
};

// Delete a short URL
export const deleteUrl = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`/delete/${id}`);
        return response.data;
    } catch (error) {
        handleUrlError(error);
    }
};

// Update a short URL - Fixed to match backend expectations
export const updateUrl = async (id: string, newURL: string) => {
    try {
        const payload = {
            newURL: newURL
        };

        const response = await axiosInstance.put(`/update/${id}`, payload);
        return response.data;
    } catch (error) {
        handleUrlError(error);
    }
};

// Get analytics for a URL
export const getAnalytics = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/analytics/${id}`);
        return response.data;
    } catch (error) {
        handleUrlError(error);
    }
};

// Generate QR code for a short URL
export const generateQRCode = async (shortCode: string) => {
    try {
        const response = await axiosInstance.get(`/qrcode/${shortCode}`, {
            responseType: "arraybuffer",
        });

        // Convert arraybuffer to base64 for image display
        const base64 = btoa(
            new Uint8Array(response.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
            )
        );
        return `data:image/png;base64,${base64}`;
    } catch (error) {
        handleUrlError(error);
    }
};

// Redirect to target URL (public)
export const redirectToTarget = async (shortCode: string) => {
    try {
        const response = await axiosInstance.get(`/${shortCode}`);
        return response.data;
    } catch (error) {
        handleUrlError(error);
    }
};