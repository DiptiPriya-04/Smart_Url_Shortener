import redis from '../db/redis.js'; 

export const getCachedURL = async (shortCode) => {
    try {
        const cached = await redis.get(`url:${shortCode}`);
        return cached ? JSON.parse(cached) : null;
    } catch (error) {
        console.error('Redis get error:', error);
        return null;
    }
};

export const setCachedURL = async (shortCode, urlData, expiry = 3600) => { // 1 hour expiry
    try {
        await redis.setex(`url:${shortCode}`, expiry, JSON.stringify(urlData));
    } catch (error) {
        console.error('Redis set error:', error);
    }
};

export const deleteCachedURL = async (shortCode) => {
    try {
        await redis.del(`url:${shortCode}`);
    } catch (error) {
        console.error('Redis delete error:', error);
    }
};

export const getCachedAnalytics = async (urlId) => {
    try {
        const cached = await redis.get(`analytics:${urlId}`);
        return cached ? JSON.parse(cached) : null;
    } catch (error) {
        console.error('Redis analytics get error:', error);
        return null;
    }
};

export const setCachedAnalytics = async (urlId, analyticsData, expiry = 900) => { // 15 minutes expiry
    try {
        await redis.setex(`analytics:${urlId}`, expiry, JSON.stringify(analyticsData));
    } catch (error) {
        console.error('Redis analytics set error:', error);
    }
};

export const invalidateAnalyticsCache = async (urlId) => {
    try {
        await redis.del(`analytics:${urlId}`);
    } catch (error) {
        console.error('Redis analytics delete error:', error);
    }
};