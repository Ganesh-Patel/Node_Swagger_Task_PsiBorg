import express from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/taskController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const taskRoutes = express.Router();

// Create Task
taskRoutes.post('/', authenticateUser, createTask);

// Get Tasks (with optional filtering and sorting)
taskRoutes.get('/', authenticateUser, getTasks);

// Update Task
taskRoutes.put('/:id', authenticateUser, updateTask);

// Delete Task
taskRoutes.delete('/:id', authenticateUser, deleteTask);

export default taskRoutes;
