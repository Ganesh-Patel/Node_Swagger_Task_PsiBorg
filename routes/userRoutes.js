import express from 'express';
import { registerUser, loginUser, logoutUser, getUserProfiles } from '../controllers/userController.js';
import { rateLimiter } from '../middlewares/rateLimitMiddleware.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import {authorizeRoles} from '../middlewares/roleMiddleware.js'

const loginLimiter = rateLimiter(15 * 60 * 1000, 5, 'Too many login attempts, please try again later.');

const userRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: User Authentication
 *   description: APIs related to user management
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags:
 *       - User Authentication
 *     summary: Register a new user
 *     description: Allows a user to register by providing a username, email, and password. A default user (`Ganesh Patel`) is already registered with the email `ganesh123@gmail.com`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: Ganesh Patel
 *               email:
 *                 type: string
 *                 example: ganesh123@gmail.com
 *               password:
 *                 type: string
 *                 example: Ganesh@123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input (e.g. email format or weak password)
 *       500:
 *         description: Internal server error
 */

userRoutes.post('/register', registerUser);

/**
  * @swagger
 * /api/users/login:
 *   post:
 *     tags:
 *       - User Authentication
 *     summary: Login a user and get a JWT token
 *     description: Allows a user to login with email and password to receive a JWT token. Use the default user credentials for testing:
 *                  - Email: `ganesh123@gmail.com`
 *                  - Password: `Ganesh@123`
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: ganesh123@gmail.com
 *               password:
 *                 type: string
 *                 example: Ganesh@123
 *     responses:
 *       200:
 *         description: User logged in successfully, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The JWT token for the logged-in user.
 *       400:
 *         description: Invalid credentials (wrong email or password)
 *       429:
 *         description: Too many login attempts (rate limit exceeded)
 *       500:
 *         description: Internal server error
 */
userRoutes.post('/login', loginLimiter, loginUser);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout the authenticated user
 *     description: Logs out the user by invalidating the JWT token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized (user not authenticated)
 *       500:
 *         description: Internal server error
 */
userRoutes.post('/logout', authenticateUser, logoutUser);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get the profile of the authenticated user
 *     description: Retrieves the profile details of the authenticated user such as username, email, and roles.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   description: The username of the user.
 *                 email:
 *                   type: string
 *                   description: The email address of the user.
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: The roles assigned to the user (e.g. admin, manager, user).
 *       401:
 *         description: Unauthorized (user not authenticated)
 *       500:
 *         description: Internal server error
 */
userRoutes.get('/profile', authenticateUser, authorizeRoles('admin','manager','user'), getUserProfiles);

export default userRoutes;
