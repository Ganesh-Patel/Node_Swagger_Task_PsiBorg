import Task from '../models/taskModel.js';
import User from '../models/userModel.js'; 
import moment from 'moment';
// Assign Task to a user
export const assignTask = async (req, res) => {
  try {
    const { taskId, userId } = req.body;

    const task = await Task.findById(taskId);
    const user = await User.findById(userId);

    if (!task || !user) {
      return res.status(404).json({ message: 'Task or User not found' });
    }

    const currentUser = req.user;

    if (!currentUser.roles.includes('admin') && !currentUser.roles.includes('manager')) {
      return res.status(403).json({ message: 'You are not authorized to assign tasks' });
    }

    // If the user is a manager, ensure they can only assign tasks to their team members
    if (currentUser.roles.includes('manager')) {
      if (!currentUser.team.includes(userId)) {
        return res.status(403).json({ 
          message: 'Managers can only assign tasks to their team members' 
        });
      }
    }

    // Assign the task to the user
    task.assignedTo = userId;
    await task.save();

    // Optional: Update the user's assignedTasks array
    user.assignedTasks.push(taskId);
    await user.save();

    res.status(200).json({ message: 'Task assigned successfully', task });
  } catch (err) {
    res.status(500).json({ message: 'Error assigning task', error: err.message });
  }
};


// View assigned tasks
export const viewAssignedTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.roles[0];

    const { status, priority, dueDate, searchTerm } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }
    if (priority) {
      query.priority = priority;
    }
    if (dueDate) {
      // Use moment.js to parse the date in DD-MM-YYYY format
      const parsedDate = moment(dueDate, 'DD-MM-YYYY');
      if (!parsedDate.isValid()) {
        return res.status(400).json({ message: 'Invalid date format. Please use DD-MM-YYYY.' });
      }
      
      // Set the start of the day (00:00:00) and the end of the day (23:59:59)
      const startOfDay = parsedDate.startOf('day').toDate();  // Start of the day
      const endOfDay = parsedDate.endOf('day').toDate();  // End of the day

      query.dueDate = { $gte: startOfDay, $lte: endOfDay };
    }

    // If there's a search term, search in title, status, and priority
    if (searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search in title
        { status: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search in status
        { priority: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search in priority
      ];
    }

    let tasks;

    if (userRole === 'admin') {
      // Admin can view all tasks
      tasks = await Task.find(query);
    } else if (userRole === 'manager') {
      // Manager can view tasks assigned to their team members
      const manager = await User.findById(userId);
      if (!manager || !manager.team) {
        return res.status(404).json({ message: 'No team found for this manager' });
      }
      tasks = await Task.find({
        assignedTo: { $in: manager.team },
        ...query,
      });
    } else if (userRole === 'user') {
      // User can view only tasks assigned to themselves
      tasks = await Task.find({
        assignedTo: userId,
        ...query,
      });
    } else {
      return res.status(403).json({ message: 'Access denied ....' });
    }

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found' });
    }

    res.status(200).json({ tasks });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving assigned tasks', error: err.message });
  }
};


export const updateTaskAssignment = async (req, res) => {
  try {
    const { taskId, newUserId } = req.body;
    const task = await Task.findById(taskId);
    const newUser = await User.findById(newUserId);

    if (!task || !newUser) {
      return res.status(404).json({ message: 'Task or User not found' });
    }

    const currentUser = req.user; 


    if (!currentUser.roles.includes('admin') && !currentUser.roles.includes('manager')) {
      return res.status(403).json({ message: 'You are not authorized to reassign tasks' });
    }

    if (currentUser.roles.includes('manager')) {
      if (!currentUser.team.includes(newUserId)) {
        return res.status(403).json({ 
          message: 'Managers can only reassign tasks to their team members' 
        });
      }
    }

    task.assignedTo = newUserId;
    await task.save();

    newUser.assignedTasks.push(taskId);
    await newUser.save();

    res.status(200).json({ message: 'Task reassigned successfully', task });
  } catch (err) {
    res.status(500).json({ message: 'Error updating task assignment', error: err.message });
  }
};

