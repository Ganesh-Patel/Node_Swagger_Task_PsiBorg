import { set, connect } from 'mongoose';
import dotenv from 'dotenv';

// Conditionally load environment variables only in development
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();  // Ensure dotenv is only loaded in non-production environments
}

const connectDB = async () => {
    set("strictQuery", false);  // Optional, based on your query preferences
    try {
        // Check if MONGO_URI is loaded correctly
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI is not defined!');
            process.exit(1);  // Exit if the URI is not defined
        }

        const conn = await connect(process.env.MONGO_URI, {
            dbName: process.env.DB,  // Ensure DB is also set in .env
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);  // Exit if connection fails
    }
};

export default connectDB;
