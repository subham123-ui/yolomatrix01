import express from "express";
import { isAdmin, userSecurityMiddleware } from "../Middleware/auth.middleware.js";
import { createApartment, deleteAppartment, getAllApartments, getApartmentById, updateAppartments } from "../Controller/appartment.controller.js";
import { upload } from "../Middleware/uploader.middleware.js";



//? Initialize the express router for authentication routes
const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Apartments
 *   description: API for managing apartments
 */

/**
 * @swagger
 * /appartments:
 *   get:
 *     summary: Get all apartments
 *     tags: [Apartments]
 *     responses:
 *       200:
 *         description: List of all apartments
 */

/**
 * @swagger
 * /appartments/{id}:
 *   get:
 *     summary: Get a specific apartment by ID
 *     tags: [Apartments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The apartment ID
 *     responses:
 *       200:
 *         description: Apartment data
 *       404:
 *         description: Apartment not found
 */

/**
 * @swagger
 * /appartments/create:
 *   post:
 *     summary: Create a new apartment
 *     tags: [Apartments]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               location:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Apartment created
 *       401:
 *         description: Unauthorized
 */

// ! get all apartment
router.get("/", getAllApartments);

// ! get specific apartment by id
router.get("/:id", getApartmentById);

// ! create apartment
router.post("/create", userSecurityMiddleware, isAdmin, upload.array("images", 10), createApartment);

// ! update appartments
router.put("/update/:id", userSecurityMiddleware, isAdmin, upload.array("images", 10), updateAppartments);

// ! dlee appartment
// Delete a mansion
router.delete("/delete/:id", userSecurityMiddleware, isAdmin, deleteAppartment);

//? Export the authentication router for use in the main app
export const appertmntRouters = router;
  