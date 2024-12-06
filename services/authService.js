import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

// Encrypt password
export const hashPassword = async (password) => await bcrypt.hash(password, 10);

// Compare password
export const comparePassword = async (password, hashedPassword) => await bcrypt.compare(password, hashedPassword);

// Generate JWT Token
export const generateToken = (user) => {
    return jwt.sign({ userId: user._id, roles: user.roles}, process.env.SECRET, { expiresIn: '1h' });
};

// Find user by email
export const findUserByEmail = async (email) => await User.findOne({ email }).exec();

// Find user by id
export const findUserById = async (id) => await User.findById(id).exec();
