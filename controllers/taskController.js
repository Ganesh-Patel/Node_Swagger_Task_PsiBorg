import Task from '../models/taskModel.js'; // Adjust path if necessary
import User from '../models/userModel.js'; // Assuming User model exists

// Create Task
export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    if (!title || !description || !dueDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      createdBy: req.user.id,
    });

    await newTask.save();
    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (err) {
    res.status(500).json({ message: 'Error creating task', error: err.message });
  }
};

// Read Task(s) - with optional filters and sorting
export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.roles[0];

    let tasks;

    if (userRole === 'admin') {
      // Admin can view all tasks
      tasks = await Task.find({});
    } else if (userRole === 'manager') {
      // Manager can view tasks assigned to their team members
      const manager = await User.findById(userId);
      if (!manager || !manager.team) {
        return res.status(404).json({ message: 'No team found for this manager' });
      }
      tasks = await Task.find({ assignedTo: { $in: manager.team } });
    } else if (userRole === 'user') {
      // User can view only tasks assigned to themselves
      tasks = await Task.find({ assignedTo: userId });
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found' });
    }

    res.status(200).json({ tasks });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving assigned tasks', error: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, priority, status } = req.body;
    const userId = req.user.id;
    const userRole = req.user.roles[0]; // Assuming roles array contains one role, adjust if needed

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Admin can update any task
    if (userRole === 'admin') {
      task.title = title || task.title;
      task.description = description || task.description;
      task.dueDate = dueDate || task.dueDate;
      task.priority = priority || task.priority;
      task.status = status || task.status;
      await task.save();

      return res.status(200).json({ message: 'Task updated successfully', task });
    }

    // Manager can only update tasks assigned to their team members
    if (userRole === 'manager') {
      const manager = await User.findById(userId);
      if (!manager || !manager.team) {
        return res.status(404).json({ message: 'No team found for this manager' });
      }

      if (!manager.team.includes(task.assignedTo.toString())) {
        return res.status(403).json({ message: 'You can only update tasks assigned to your team members' });
      }

      task.title = title || task.title;
      task.description = description || task.description;
      task.dueDate = dueDate || task.dueDate;
      task.priority = priority || task.priority;
      task.status = status || task.status;
      await task.save();

      return res.status(200).json({ message: 'Task updated successfully', task });
    }

    // User can only update their own tasks
    if (userRole === 'user' && task.assignedTo.toString() === userId) {
      task.title = title || task.title;
      task.description = description || task.description;
      task.dueDate = dueDate || task.dueDate;
      task.priority = priority || task.priority;
      task.status = status || task.status;
      await task.save();

      return res.status(200).json({ message: 'Task updated successfully', task });
    }

    return res.status(403).json({ message: 'You are not authorized to update this task' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating task', error: err.message });
  }
};

// Delete Task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.roles[0];

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Admin can delete any task
    if (userRole === 'admin') {
      await Task.findByIdAndDelete(id); 
      return res.status(200).json({ message: 'Task deleted successfully' });
    }

    // Manager can only delete tasks assigned to their team members
    if (userRole === 'manager') {
      const manager = await User.findById(userId);
      if (!manager || !manager.team) {
        return res.status(404).json({ message: 'No team found for this manager' });
      }

      if (!manager.team.includes(task.assignedTo.toString())) {
        return res.status(403).json({ message: 'You can only delete tasks assigned to your team members' });
      }

      await Task.findByIdAndDelete(id); 
      return res.status(200).json({ message: 'Task deleted successfully' });
    }

    // Users are not allowed to delete tasks
    return res.status(403).json({ message: 'You are not authorized to delete this task' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task', error: err.message });
  }
};


