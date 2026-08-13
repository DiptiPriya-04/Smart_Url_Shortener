import express from "express"
import { deleteCreatedURL, generateQRCode, getAllCreatedCodes, getAnalytics, getTargetURL, shorten, updateCreatedURL } from "../controllers/url.controller.js";
import { authenticationMiddleware } from "../middlewares/auth.middleware.js"

const router = express.Router();

// create a short url from a long url
router.post("/shorten", authenticationMiddleware, shorten);

// user will get all his created codes
router.get("/codes", authenticationMiddleware, getAllCreatedCodes);

// delete ur created url
router.delete("/delete/:id", authenticationMiddleware, deleteCreatedURL);

//  update the destination (long) URL of an existing short URL
router.put("/update/:id", authenticationMiddleware, updateCreatedURL);

// get url analytics 
router.get("/analytics/:id", authenticationMiddleware, getAnalytics);

// generate QRCode
router.get("/qrcode/:shortCode", authenticationMiddleware, generateQRCode);

// this route is public route..no authentication required
// /:shortCode is path parameter..this controller is to redirect the user to the targetURL
router.get("/:shortCode", getTargetURL);

export default router;