import Task from '../models/taskModel.js';
import User from '../models/userModel.js'; 
// Assign Task to a user
export const assignTask = async (req, res) => {
  try {
    const { taskId, userId } = req.body; 


    const task = await Task.findById(taskId);
    const user = await User.findById(userId);

    if (!task || !user) {
      return res.status(404).json({ message: 'Task or User not found' });
    }
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'You are not authorized to assign tasks' });
    }
    task.assignedTo = userId;
    await task.save();

    res.status(200).json({ message: 'Task assigned successfully', task });
  } catch (err) {
    res.status(500).json({ message: 'Error assigning task', error: err.message });
  }
};

// View assigned tasks
export const viewAssignedTasks = async (req, res) => {
  try {
    const userId = req.user.id; 
    const tasks = await Task.find({ assignedTo: userId });

    if (!tasks.length) {
      return res.status(404).json({ message: 'No tasks assigned' });
    }

    res.status(200).json({ tasks });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving assigned tasks', error: err.message });
  }
};

// Update Task Assignment (e.g., reassign task to a different user)
export const updateTaskAssignment = async (req, res) => {
  try {
    const { taskId, newUserId } = req.body; 
    const task = await Task.findById(taskId);
    const newUser = await User.findById(newUserId);

    if (!task || !newUser) {
      return res.status(404).json({ message: 'Task or User not found' });
    }
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'You are not authorized to reassign tasks' });
    }
    task.assignedTo = newUserId;
    await task.save();

    res.status(200).json({ message: 'Task reassigned successfully', task });
  } catch (err) {
    res.status(500).json({ message: 'Error updating task assignment', error: err.message });
  }
};
