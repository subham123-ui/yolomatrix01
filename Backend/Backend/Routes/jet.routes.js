import express from "express";
import { userSecurityMiddleware, isAdmin } from "../Middleware/auth.middleware.js";
import { upload } from "../Middleware/uploader.middleware.js";
import {
  getAllJets,
  getJetById,
  createJet,
  updateJet,
  deleteJet,
} from "../Controller/jet.controller.js";

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Jets
 *   description: API endpoints for managing private jets
 */

/**
 * @swagger
 * /jets:
 *   get:
 *     summary: Get all jets
 *     tags: [Jets]
 *     responses:
 *       200:
 *         description: List of all jets
 */

/**
 * @swagger
 * /jets/{id}:
 *   get:
 *     summary: Get a jet by ID
 *     tags: [Jets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The jet ID
 *     responses:
 *       200:
 *         description: Jet data
 *       404:
 *         description: Jet not found
 */

/**
 * @swagger
 * /jets/create:
 *   post:
 *     summary: Create a new jet
 *     tags: [Jets]
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
 *               model:
 *                 type: string
 *               manufacturer:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Jet created
 *       403:
 *         description: Forbidden - not an admin
 */

/**
 * @swagger
 * /jets/update/{id}:
 *   put:
 *     summary: Update a jet by ID
 *     tags: [Jets]
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
 *               model:
 *                 type: string
 *               manufacturer:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Jet updated
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /jets/delete/{id}:
 *   delete:
 *     summary: Delete a jet by ID
 *     tags: [Jets]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Jet deleted
 *       403:
 *         description: Forbidden
 */

// ! Get all jets
router.get("/", getAllJets); 

// ! Get specific jet by ID
router.get("/:id", getJetById);

// ! Create a new jet
router.post("/create", userSecurityMiddleware, isAdmin, upload.array("images", 10), createJet);

// ! Update a jet
router.put("/update/:id", userSecurityMiddleware, isAdmin, upload.array("images", 10), updateJet);

// ! Delete a jet
router.delete("/delete/:id", userSecurityMiddleware, isAdmin, deleteJet);

//? Export the router
export const jetRouters = router;
