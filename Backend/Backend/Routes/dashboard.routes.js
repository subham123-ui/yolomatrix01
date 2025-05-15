import express from "express";
import { isAdmin, userSecurityMiddleware } from "../Middleware/auth.middleware.js";
import {getDashboardStats} from "../Controller/dashboard.controller.js";


//? Initialize the express router for authentication routes
const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: API for retrieving admin dashboard statistics
 */

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *       401:
 *         description: Unauthorized - user not authenticated
 *       403:
 *         description: Forbidden - user is not an admin
 */

// ! get all apartment
// TODO: add userSecurityMiddleware and isAdmin middleware to protect the route
router.get("/", getDashboardStats);


export const dashboardRouters = router;