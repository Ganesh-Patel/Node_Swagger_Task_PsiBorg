
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import sendEmail from '../services/sendEmail.js';
import { validateEmail, validatePassword } from '../utils/validator.js';
import { hashPassword, comparePassword, generateToken } from '../services/authService.js';
import dotenv from 'dotenv'


dotenv.config();

// Register User
export const registerUser = async (req, res) => {
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

// Login User
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).exec();
        if (!user || !await comparePassword(password, user.password)) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user);

        res.cookie("auth_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 3600000,
      }).status(200)
      .json({id:user._id,email:user.email,role:user.roles[0],
        message: "Login Successful"  
      });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
};



// Logout User
export const logoutUser = (req, res) => {
    try {
        res.clearCookie("auth_token").status(200).json({ message: "Logout successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }
   
};

// Get User Profile
export const getUserProfiles = async (req, res) => {
    try {
      const userId = req.user.id;  
      const userRole = req.user.roles[0]; 
  
      let users;
  
      if (userRole === 'admin') {
        users = await User.find(); 
      } else if (userRole === 'manager') {
        const manager = await User.findById(userId);
        if (!manager || !manager.team) {
          return res.status(404).json({ message: 'No team found for this manager' });
        }
        users = await User.find({
          _id: { $in: manager.team }, 
        });
      } else if (userRole === 'user') {
        users = await User.findById(userId); 
      } else {
        return res.status(403).json({ message: 'Access denied' }); 
      }
  
      if (!users || (Array.isArray(users) && users.length === 0)) {
        return res.status(404).json({ message: 'No profiles found' });
      }
  
      res.status(200).json({ users });
  
    } catch (err) {
      res.status(500).json({ message: 'Error retrieving user profiles', error: err.message });
    }
  };


