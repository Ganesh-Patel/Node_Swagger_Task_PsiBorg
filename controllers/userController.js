
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
      .json({user,
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
export const getUserProfile = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            username: user.username,
            email: user.email,
            roles: user.roles
        });
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};


