import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createShortUrl,
    getAllUserUrls,
    deleteUrl,
    updateUrl,
    getAnalytics,
    generateQRCode,
} from "@/lib/url.api";
import type { ShortenData } from "@/types/types";
import { toast } from "react-hot-toast";

// get all urls
export const useUserUrls = () => {
    return useQuery({
        queryKey: ["urls"],
        queryFn: getAllUserUrls,
        staleTime: 1000 * 60 * 5, // 5 min
        retry: (failureCount, error: any) => {
            // Don't retry on 401 (Unauthorized)
            if (error?.status === 401) {
                return false;
            }
            return failureCount < 3; // Retry up to 3 times
        },
    });
};

// create short url
export const useCreateShortUrl = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ShortenData) => createShortUrl(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["urls"] });
            toast.success("URL shortened successfully!");
        },
        onError: (err: any) => {
            console.log("Error object:", err); // Debug log (remove later)
            const message =
                err?.response?.data?.error || // backend sends { error: "..." }
                err?.response?.data?.message || // fallback if backend uses "message"
                err?.message ||
                "Failed to create short URL";
            toast.error(message);
        },

    });
};

// delete short url
export const useDeleteUrl = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteUrl(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["urls"] });
            toast.success("URL deleted successfully!");
        },
        onError: (err: any) => {
            const message = err?.message || "Failed to delete URL";
            toast.error(message);
        },
    });
};

// update url
export const useUpdateUrl = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, newURL }: { id: string; newURL: string }) => updateUrl(id, newURL),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["urls"] });
            toast.success("URL updated successfully!");
        },
        onError: (err: any) => {
            const message = err?.message || "Failed to update URL";
            toast.error(message);
        },
    });
};

// get analytics
export const useAnalytics = (id: string) => {
    return useQuery({
        queryKey: ["analytics", id],
        queryFn: () => getAnalytics(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 min
        retry: (failureCount, error: any) => {
            // Don't retry on 401 (Unauthorized)
            if (error?.status === 401) {
                return false;
            }
            return failureCount < 3; // Retry up to 3 times
        },
    });
};

// generate QR - Fixed: Changed from useQuery to useMutation since it's an action
export const useGenerateQRCode = () => {
    return useMutation({
        mutationFn: (shortCode: string) => generateQRCode(shortCode),
        onError: (err: any) => {
            const message = err?.message || "Failed to generate QR code";
            toast.error(message);
        },
    });
};