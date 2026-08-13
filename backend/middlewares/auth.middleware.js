/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */

import { validateUserToken } from "../utils/token.js";

export const authenticationMiddleware = (req, res, next) => {
    try {
        let token;
        const authHeader = req.headers["authorization"];
        const cookieAuth = req.cookies["Authorization"];

        // Try to get token from either header or cookie
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else if (cookieAuth) {
            token = cookieAuth.replace("Bearer ", "");
        }

        if (!token) {
            return res.status(401).json({
                error: "No authentication token provided"
            });
        }

        // Validate token
        const payload = validateUserToken(token);
        if (!payload) {
            return res.status(401).json({
                error: "Invalid authentication token"
            });
        }

        req.user = payload;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(401).json({
            error: "Authentication failed"
        });
    }
}

export const ensureAuthenticated = (req,res,next) => {
    if(!req.user || !req.user.id){
        return res.status(401).json({
            error: "You must be logged in to access this resource"
        })
    }
    next();
}