import express from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/taskController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js'; 

const taskRoutes = express.Router();

// Create Task
taskRoutes.post('/', authenticateUser,authorizeRoles('admin','manager'), createTask);

// Get Tasks (with optional filtering and sorting)
taskRoutes.get('/', authenticateUser,authorizeRoles('admin','manager','user'), getTasks);

// Update Task
taskRoutes.put('/:id', authenticateUser,authorizeRoles('admin','manager','user'), updateTask);

// Delete Task
taskRoutes.delete('/delete/:id', authenticateUser,authorizeRoles('admin','manager'), deleteTask);

export default taskRoutes;
