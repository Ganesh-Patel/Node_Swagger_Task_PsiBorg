
import User from '../models/userModel.js';
import sendEmail from '../services/sendEmail.js';
import { validateEmail, validatePassword } from '../utils/validator.js';
import { hashPassword} from '../services/authService.js';
import dotenv from 'dotenv'


dotenv.config();

// Register User
export const addUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!validatePassword(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    try {
        const hashedPassword = await hashPassword(password);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        await sendEmail(email, username);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
};
// Delete a user by ID
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
    
        const result = await User.findByIdAndDelete(id);
        if (!result) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        res.status(200).json({ message: 'User deleted successfully' });
      } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err.message });
      }
  };
  
  // Get a single user by ID
  export const getUserById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ user });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching user details', error: err.message });
    }
  };
  
  // Get all users
  export const getAllUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json({ users });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
  };
  
  // Change a user's role
  export const changeUserRole = async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
  
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.roles[0] = role;
      await user.save();
  
      res.status(200).json({ message: 'User role updated successfully', user });
    } catch (err) {
      res.status(500).json({ message: 'Error updating user role', error: err.message });
    }
  };