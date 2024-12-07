import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { 
        type: String,
         required: true, 
         unique: true },
    email: {
         type: String,
         required: true,
          unique: true },
    password: {
         type: String,
          required: true },
    roles: { 
        type: [String], 
        default: ['User'] 
    },
      team: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User', // Reference to other users
            },
          ],
          
          assignedTasks: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Task', // Reference to Task model
            },
          ],
        },
        { timestamps: true }
        
    );

const User = mongoose.model('User', userSchema);

export default User;
