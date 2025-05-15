import express from "express";
import { userSecurityMiddleware, isAdmin } from "../Middleware/auth.middleware.js";
import { upload } from "../Middleware/uploader.middleware.js";
import {
  getAllYachts,
  getYachtById,
  createYacht,
  updateYacht,
  deleteYacht,
} from "../Controller/yacht.controller.js";

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Yachts
 *   description: API endpoints for managing yachts
 */

/**
 * @swagger
 * /yachts:
 *   get:
 *     summary: Get all yachts
 *     tags: [Yachts]
 *     responses:
 *       200:
 *         description: A list of all yachts
 */

/**
 * @swagger
 * /yachts/{id}:
 *   get:
 *     summary: Get yacht by ID
 *     tags: [Yachts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Yacht ID
 *     responses:
 *       200:
 *         description: Yacht found
 *       404:
 *         description: Yacht not found
 */

/**
 * @swagger
 * /yachts/create:
 *   post:
 *     summary: Create a new yacht
 *     tags: [Yachts]
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
 *               type:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Yacht created successfully
 *       403:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /yachts/update/{id}:
 *   put:
 *     summary: Update a yacht
 *     tags: [Yachts]
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
 *         description: Yacht ID
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
 *               type:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Yacht updated
 *       403:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /yachts/delete/{id}:
 *   delete:
 *     summary: Delete a yacht
 *     tags: [Yachts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Yacht ID
 *     responses:
 *       200:
 *         description: Yacht deleted
 *       403:
 *         description: Unauthorized
 */

// ! Get all yachts
router.get("/", getAllYachts);

// ! Get yacht by ID
router.get("/:id", getYachtById);

// ! Create a new yacht
router.post("/create", userSecurityMiddleware, isAdmin, upload.array("images", 10), createYacht);

// ! Update a yacht
router.put("/update/:id", userSecurityMiddleware, isAdmin, upload.array("images", 10), updateYacht);

// ! Delete a yacht
router.delete("/delete/:id", userSecurityMiddleware, isAdmin, deleteYacht);

export const yachtRouters = router;
