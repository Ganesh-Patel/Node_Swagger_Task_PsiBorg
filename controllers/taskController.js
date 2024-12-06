import Task from '../models/taskModel.js'; // Adjust path if necessary
import User from '../models/userModel.js'; // Assuming User model exists

// Create Task
export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;
    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      user: req.user.id, // Associate task with the authenticated user
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
    const { status, priority, sortBy } = req.query;
    
    let query = { user: req.user.id }; // Ensure the tasks are associated with the user

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    const tasks = await Task.find(query).sort(sortBy ? { [sortBy]: 1 } : { createdAt: -1 });
    res.status(200).json({ tasks });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving tasks', error: err.message });
  }
};

// Update Task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, priority, status } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user.id }, // Ensure only the user who created the task can update it
      { title, description, dueDate, priority, status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found or you do not have permission' });
    }

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (err) {
    res.status(500).json({ message: 'Error updating task', error: err.message });
  }
};

// Delete Task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or you do not have permission' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task', error: err.message });
  }
};
