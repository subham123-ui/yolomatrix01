import express from "express";
import {
  getAllMansions,
  getMansionById,
  createMansion,
  updateMansion,
  deleteMansion,
} from "../Controller/mansion.controller.js";
import { isAdmin, userSecurityMiddleware } from "../Middleware/auth.middleware.js";
import { upload } from "../Middleware/uploader.middleware.js";

// Initialize the router
const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Mansions
 *   description: Endpoints for managing luxurious mansions
 */

/**
 * @swagger
 * /mansions:
 *   get:
 *     summary: Get all mansions
 *     tags: [Mansions]
 *     responses:
 *       200:
 *         description: List of mansions
 */

/**
 * @swagger
 * /mansions/{id}:
 *   get:
 *     summary: Get a mansion by ID
 *     tags: [Mansions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mansion ID
 *     responses:
 *       200:
 *         description: Mansion details
 *       404:
 *         description: Mansion not found
 */

/**
 * @swagger
 * /mansions/create:
 *   post:
 *     summary: Create a new mansion
 *     tags: [Mansions]
 *     security:
 *       - cookieAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Mansion created
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /mansions/update/{id}:
 *   put:
 *     summary: Update a mansion
 *     tags: [Mansions]
 *     security:
 *       - cookieAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mansion ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Mansion updated
 *       403:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /mansions/delete/{id}:
 *   delete:
 *     summary: Delete a mansion
 *     tags: [Mansions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mansion ID
 *     responses:
 *       200:
 *         description: Mansion deleted
 *       403:
 *         description: Unauthorized
 */


// Get all mansions
router.get("/", getAllMansions);

// Get a mansion by ID
router.get("/:id", getMansionById);

//TODO : add userSecurityMiddleware and isAdmin middleware to protect the route
// Create a new mansion
router.post("/create", upload.array("images", 10), createMansion);

// Update a mansion
router.put("/update/:id", userSecurityMiddleware, isAdmin, upload.array("images", 10), updateMansion);

// Delete a mansion
router.delete("/delete/:id", userSecurityMiddleware, isAdmin, deleteMansion);

// Export the mansion router
export const mansionRouters = router;
