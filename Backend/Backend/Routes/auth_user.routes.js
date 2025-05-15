import express from "express";
import { register_Controller, loginController, logoutController, login_adminController } from "../Controller/auth_user.controller.js";
import { isAdmin, userSecurityMiddleware } from "../Middleware/auth.middleware.js";
import passport from 'passport';

// !===================================================
// ?==============  Authentication Routes ============
// ?===================================================
//* - Handles user signup requests for registration
//* - Handles user login requests for login
//* - Handles user logout requests for logout
//* - Handles Google OAuth authentication

// !===================================================

//? Initialize the express router for authentication routes
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration, login and logout
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */

//? POST request to "/signup" to handle user registration
router.post("/register", register_Controller);

//? POST request to "/login" to handle user registration
router.post("/login", loginController);
router.post("/login/admin", login_adminController);

//? POST request to "/logout" to handle user registration
router.post("/logout", userSecurityMiddleware, logoutController);

//? Google OAuth routes
router.get("/google",
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

router.get("/google/callback",
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: false 
  }),
  async (req, res) => {
    try {
      // Generate JWT token
      const token = req.user.generateAuthToken();
      
      // Set token in cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Redirect to frontend with success
      res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=Authentication failed`);
    }
  }
);

//? Export the authentication router for use in the main app
export const authRouters = router;
 