import express from 'express';
import { authenticateUser } from '../middlewares/authMiddleware.js';  // Assuming you have JWT authentication middleware
import { authorizeRoles } from '../middlewares/roleMiddleware.js';  // Role-based authorization middleware
import { 
  addUser, 
  deleteUser, 
  updateUser, 
  getUserById, 
  getAllUsers, 
  changeUserRole 
} from '../controllers/userController.js';

const userManagementRoutes = express.Router();

// Admin can add a new user
userManagementRoutes.post('/add-user', authenticateUser, authorizeRoles('admin'), addUser);

// Admin can delete a user by ID
userManagementRoutes.delete('/delete-user/:id', authenticateUser, authorizeRoles('admin'), deleteUser);

// Admin can update a user's details (e.g., role, name, etc.)
userManagementRoutes.put('/update-user/:id', authenticateUser, authorizeRoles('admin'), updateUser);

// Admin can get details of a single user
userManagementRoutes.get('/user/:id', authenticateUser, authorizeRoles('admin'), getUserById);

// Admin can get a list of all users
userManagementRoutes.get('/users', authenticateUser, authorizeRoles('admin'), getAllUsers);

// Admin can change the role of a user
userManagementRoutes.put('/change-role/:id', authenticateUser, authorizeRoles('admin'), changeUserRole);

export default userManagementRoutes;
