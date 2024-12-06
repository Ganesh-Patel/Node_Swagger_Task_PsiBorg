import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json' assert { type: 'json' };
import userRoutes from './routes/userRoutes.js';
import connectDB from './config/connectToDatabase.js';
import userManagementRoutes from './routes/userManagementRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import taskAssignRoutes from './routes/taskAssignmentRoutes.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
}));
app.use(cookieParser());
app.set('trust proxy', true);
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/users', userRoutes);  
app.use('/api/admin/', userManagementRoutes); 
app.use('/admin/task', taskRoutes);
app.use('/admin/taskAssigen', taskAssignRoutes);

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
