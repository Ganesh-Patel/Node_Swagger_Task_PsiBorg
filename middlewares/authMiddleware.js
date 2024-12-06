import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { findUserById } from '../services/authService.js';

dotenv.config();

// Protect route with JWT Token
export const authenticateUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await findUserById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;  // Attach user to the request object
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
