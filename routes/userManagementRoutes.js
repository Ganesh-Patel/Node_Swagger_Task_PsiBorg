import express from 'express';
import { authenticateUser } from '../middlewares/authMiddleware.js';  // Assuming you have JWT authentication middleware
import { authorizeRoles } from '../middlewares/roleMiddleware.js';  // Role-based authorization middleware
import { 
  addUser, 
  deleteUser, 
  getUserById, 
  getAllUsers, 
  changeUserRole 
} from '../controllers/userManagementController.js';
import { roleBasedRateLimiter } from '../middlewares/roleBasedRateLimiter.js';

const userManagementRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: User Management
 *   description: APIs related to user management
 */
/**
 * @swagger
 * /admin/add-user:
 *   post:
 *     summary: Add a new user
 *     tags: [UserManagement]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, manager, user]
 *     responses:
 *       201:
 *         description: User added successfully
 *       400:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
userManagementRoutes.post('/add-user', authenticateUser, authorizeRoles('admin'),roleBasedRateLimiter, addUser);

/**
 * @swagger
 * /admin/delete-user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [UserManagement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
userManagementRoutes.delete('/delete-user/:id', authenticateUser, authorizeRoles('admin'),roleBasedRateLimiter, deleteUser);

/**
 * @swagger
 * /admin/user/{id}:
 *   get:
 *     summary: Get details of a single user
 *     tags: [UserManagement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
userManagementRoutes.get('/user/:id', authenticateUser, authorizeRoles('admin'),roleBasedRateLimiter, getUserById);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get a list of all users
 *     tags: [UserManagement]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *       500:
 *         description: Internal server error
 */
userManagementRoutes.get('/users', authenticateUser, authorizeRoles('admin'),roleBasedRateLimiter, getAllUsers);

/**
 * @swagger
 * /admin/change-role/{id}:
 *   put:
 *     summary: Change a user's role
 *     tags: [UserManagement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, manager, user]
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
userManagementRoutes.put('/change-role/:id', authenticateUser, authorizeRoles('admin'),roleBasedRateLimiter, changeUserRole);

export default userManagementRoutes;
