import express from 'express';
import { assignTask, viewAssignedTasks, updateTaskAssignment } from '../controllers/taskAssignmentController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js'; 

const taskAssignRoutes = express.Router();

taskAssignRoutes.post('/assign', authenticateUser, authorizeRoles('admin','manager'),assignTask);
taskAssignRoutes.get('/assigned-tasks', authenticateUser, authorizeRoles('admin','manager','user'), viewAssignedTasks);
taskAssignRoutes.put('/update-assignment', authenticateUser, authorizeRoles('admin','manager'), updateTaskAssignment);

export default taskAssignRoutes;
