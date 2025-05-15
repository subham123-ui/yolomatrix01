import express from "express";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../Controller/concierge.controller.js";
import { userSecurityMiddleware, isAdmin } from "../Middleware/auth.middleware.js";
import { upload } from "../Middleware/uploader.middleware.js";

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Concierge Services
 *   description: API for managing concierge services
 */

/**
 * @swagger
 * /concierge:
 *   get:
 *     summary: Get all concierge services
 *     tags: [Concierge Services]
 *     responses:
 *       200:
 *         description: A list of concierge services
 */

/**
 * @swagger
 * /concierge/{id}:
 *   get:
 *     summary: Get a concierge service by ID
 *     tags: [Concierge Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Concierge service ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Concierge service data
 *       404:
 *         description: Service not found
 */

/**
 * @swagger
 * /concierge/create:
 *   post:
 *     summary: Create a new concierge service
 *     tags: [Concierge Services]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *               - serviceType
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               serviceType:
 *                 type: string
 *               available:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Concierge service created
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /concierge/update/{id}:
 *   put:
 *     summary: Update a concierge service
 *     tags: [Concierge Services]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Concierge service ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               serviceType:
 *                 type: string
 *               available:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Service updated
 *       404:
 *         description: Service not found
 */

/**
 * @swagger
 * /concierge/delete/{id}:
 *   delete:
 *     summary: Delete a concierge service
 *     tags: [Concierge Services]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Concierge service ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service deleted
 *       404:
 *         description: Service not found
 */



//! Get all concierge services
router.get("/", getAllServices);
 
//! Get a service by ID
router.get("/:id", getServiceById);

//! Create a new service
// router.post("/create", userSecurityMiddleware, isAdmin, createService);
router.post("/create", userSecurityMiddleware, isAdmin, upload.array("images", 10), createService);

//! Update an existing service
router.put("/update/:id", userSecurityMiddleware, isAdmin, upload.array("images", 10), updateService);

//! Delete a service
router.delete("/delete/:id", userSecurityMiddleware, isAdmin, deleteService);

export const conciergeRouters = router;
