import { shortenBodySchema } from "../validation/request.validation.js";
import { nanoid } from "nanoid";
import { insertShortCodeIntoTable, updateURLFromTable, urlBelongsToUser, deleteURLFromTable } from "../services/url.service.js";
import { urlsTable, urlAnalyticsTable } from "../models/url.model.js";
import { and, eq, sql } from "drizzle-orm";
import db from "../db/index.js";
import { UAParser } from "ua-parser-js";
import fetch from "node-fetch";
import QRCode from "qrcode";
import { 
    getCachedURL, 
    setCachedURL, 
    deleteCachedURL, 
    getCachedAnalytics, 
    setCachedAnalytics, 
    invalidateAnalyticsCache 
} from "../utils/redis.js";

export const shorten = async (req, res) => {
    try {
        const validationResult = await shortenBodySchema.safeParseAsync(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: validationResult.error.errors.map(e => e.message).join(", "),
            });
        }

        const { url, code } = validationResult.data;

        // Check if custom code already exists
        if (code) {
            const [existingUrl] = await db
                .select()
                .from(urlsTable)
                .where(eq(urlsTable.shortCode, code));

            if (existingUrl) {
                return res.status(409).json({
                    error: "Custom short code already exists. Please choose a different one.",
                });
            }
        }

        // Insert with retry on random collision
        let shortCode = code ?? nanoid(6);
        let result;
        for (let i = 0; i < 3; i++) {
            try {
                result = await insertShortCodeIntoTable(shortCode, url, req.user.id);
                break;
            } catch (err) {
                if (err.code === "23505") {
                    shortCode = nanoid(6);
                } else {
                    throw err;
                }
            }
        }

        if (!result) {
            return res.status(500).json({
                error: "Failed to generate unique short code after multiple attempts.",
            });
        }

        return res.status(201).json({
            id: result.id,
            shortCode: result.shortCode,
            targetURL: result.targetURL,
        });
    } catch (error) {
        console.error(error);
        if (error.code === "23505") {
            return res.status(409).json({
                error: "This short code is already taken. Please try a different one.",
            });
        }
        return res.status(500).json({ error: error.message });
    }
};

export const getTargetURL = async (req, res) => { 
    try {
        const { shortCode } = req.params;

        // Try to get from cache first
        const cachedURL = await getCachedURL(shortCode);
        if (cachedURL) {
            // Collect analytics even for cached URLs
            await collectAnalytics(cachedURL.id, req);
            return res.redirect(cachedURL.targetURL);
        }

        // Find the target URL for the given short code
        const [url] = await db
            .select({
                id: urlsTable.id,
                targetURL: urlsTable.targetURL,
            })
            .from(urlsTable)
            .where(eq(urlsTable.shortCode, shortCode));

        if (!url) {
            return res.status(404).json({ error: "Short URL not found" });
        }

        // Cache the URL for future requests
        await setCachedURL(shortCode, url);

        // Collect analytics info
        await collectAnalytics(url.id, req);

        // Redirect user to the original URL
        return res.redirect(url.targetURL);
    } catch (error) {
        console.error("Error in getTargetURL:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Helper function for analytics collection
const collectAnalytics = async (urlId, req) => {
    try {
        const userAgent = req.headers["user-agent"];
        const parser = new UAParser(userAgent);
        const ua = parser.getResult();

        // Detect IP address (supports proxies)
        const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

        let location = { country: "Unknown", region: "Unknown", city: "Unknown" };

        // Handle localhost IPs gracefully
        if (ip === "::1" || ip === "127.0.0.1") {
            location = { country: "Localhost", region: "Local", city: "Dev Machine" };
        } else {
            try {
                const geo = await fetch(`https://ipapi.co/${ip}/json/`).then((r) => r.json());
                location = {
                    country: geo.country_name || "Unknown",
                    region: geo.region || "Unknown",
                    city: geo.city || "Unknown",
                };
            } catch (geoError) {
                console.warn("Geo lookup failed:", geoError.message);
            }
        }

        // Store analytics data
        await db.insert(urlAnalyticsTable).values({
            urlId: urlId,
            ipAddress: ip,
            region: location.region,
            country: location.country,
            city: location.city,
            deviceType: ua.device.type || "desktop",
            browser: ua.browser.name || "unknown",
            userAgent,
        });

        // Invalidate analytics cache since we have new data
        await invalidateAnalyticsCache(urlId);
    } catch (error) {
        console.error("Error collecting analytics:", error);
    }
};

export const getAllCreatedCodes = async(req,res) => {
    try{
        const codes = await db.select()
        .from(urlsTable)
        .where(eq(urlsTable.userId, req.user.id));

        return res.status(200).json({
            codes
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

export const deleteCreatedURL = async(req,res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;
        
        const existingURL = await urlBelongsToUser(id, userId);

        if (!existingURL) {
            return res.status(404).json({
                error: "URL not found or you don't have permission to delete it"
            });
        }

        await deleteURLFromTable(id, userId);

        // Delete from cache
        await deleteCachedURL(existingURL.shortCode);
        await invalidateAnalyticsCache(id);

        return res.status(200).json({
            success: true,
            message: "Deleted successfully"
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

export const updateCreatedURL = async(req,res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;
        const { newURL } = req.body; 
        
        if(!newURL || typeof newURL !== "string") {
            return res.status(400).json({ error: "New URL is required" });
        }

        const existingURL = await urlBelongsToUser(id, userId);

        if(!existingURL) {
            return res.status(404).json({
                error: "URL not found or you don't have permission to update it"
            });
        }

        const updated = await updateURLFromTable(id, userId, newURL);

        // Update cache with new URL data
        await setCachedURL(updated.shortCode, {
            id: updated.id,
            targetURL: newURL
        });

        // Invalidate analytics cache
        await invalidateAnalyticsCache(id);

        return res.status(200).json({
            success: true,
            message: "URL updated successfully",
            updated
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

export const getAnalytics = async (req, res) => {
    try {
        const { id } = req.params;

        // Try to get from cache first
        const cachedAnalytics = await getCachedAnalytics(id);
        if (cachedAnalytics) {
            return res.json(cachedAnalytics);
        }

        // Verify URL existence
        const [url] = await db
            .select({
                id: urlsTable.id,
                targetURL: urlsTable.targetURL,
                shortCode: urlsTable.shortCode,
            })
            .from(urlsTable)
            .where(eq(urlsTable.id, id));

        if (!url) {
            return res.status(404).json({ error: "URL not found" });
        }

        // Total clicks
        const [totalClicks] = await db
            .select({ count: sql`COUNT(*)` })
            .from(urlAnalyticsTable)
            .where(eq(urlAnalyticsTable.urlId, id));

        // Grouped stats
        const [byCountry, byDevice, byBrowser, dailyStats] = await Promise.all([
            db.select({
                country: urlAnalyticsTable.country,
                count: sql`COUNT(*)`,
            })
            .from(urlAnalyticsTable)
            .where(eq(urlAnalyticsTable.urlId, id))
            .groupBy(urlAnalyticsTable.country),

            db.select({
                deviceType: urlAnalyticsTable.deviceType,
                count: sql`COUNT(*)`,
            })
            .from(urlAnalyticsTable)
            .where(eq(urlAnalyticsTable.urlId, id))
            .groupBy(urlAnalyticsTable.deviceType),

            db.select({
                browser: urlAnalyticsTable.browser,
                count: sql`COUNT(*)`,
            })
            .from(urlAnalyticsTable)
            .where(eq(urlAnalyticsTable.urlId, id))
            .groupBy(urlAnalyticsTable.browser),

            // Optional: clicks per day
            db.select({
                date: sql`DATE(${urlAnalyticsTable.createdAt})`,
                count: sql`COUNT(*)`,
            })
            .from(urlAnalyticsTable)
            .where(eq(urlAnalyticsTable.urlId, id))
            .groupBy(sql`DATE(${urlAnalyticsTable.createdAt})`)
            .orderBy(sql`DATE(${urlAnalyticsTable.createdAt})`),
        ]);

        // Prepare analytics data
        const analyticsData = {
            url: {
                id: url.id,
                shortCode: url.shortCode,
                targetURL: url.targetURL,
            },
            analytics: {
                totalClicks: Number(totalClicks.count || 0),
                byCountry,
                byDevice,
                byBrowser,
                dailyStats,
            },
        };

        // Cache the analytics data
        await setCachedAnalytics(id, analyticsData);

        // Return combined analytics
        return res.json(analyticsData);
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const generateQRCode = async (req, res) => {
    try {
        const { shortCode } = req.params;

        // Try to get from cache first
        const cachedURL = await getCachedURL(shortCode);
        let targetURL;

        if (cachedURL) {
            targetURL = cachedURL.targetURL;
        } else {
            // Fetch the target URL from DB
            const [url] = await db
                .select({
                    id: urlsTable.id,
                    targetURL: urlsTable.targetURL,
                    shortCode: urlsTable.shortCode,
                })
                .from(urlsTable)
                .where(eq(urlsTable.shortCode, shortCode));

            if (!url) {
                return res.status(404).json({ error: "Short URL not found" });
            }
            targetURL = url.targetURL;
        }

        // Build the full short URL (your base domain + short code)
        const fullShortURL = `${process.env.BASE_URL || "http://localhost:3000"}/${shortCode}`;

        // Generate QR Code as PNG Buffer
        const qrBuffer = await QRCode.toBuffer(fullShortURL, {
            width: 300,
            color: {
                dark: "#000000",  // Black modules
                light: "#ffffff", // White background
            },
            errorCorrectionLevel: "H",
        });

        // Send the image directly
        res.setHeader("Content-Type", "image/png");
        res.send(qrBuffer);

    } catch (error) {
        console.error("Error generating QR Code:", error);
        return res.status(500).json({ error: "Failed to generate QR code" });
    }
};