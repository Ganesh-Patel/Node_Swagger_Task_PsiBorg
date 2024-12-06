import express from 'express';
import { assignTask, viewAssignedTasks, updateTaskAssignment } from '../controllers/taskAssignmentController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const taskAssignRoutes = express.Router();

taskAssignRoutes.post('/assign', authenticateUser, assignTask);
taskAssignRoutes.get('/assigned', authenticateUser, viewAssignedTasks);
taskAssignRoutes.put('/update-assignment', authenticateUser, updateTaskAssignment);

export default taskAssignRoutes;
