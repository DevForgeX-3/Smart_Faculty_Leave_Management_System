const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = 
      process.env.MONGODB_URI || 
      process.env.MONGO_URL || 
      'mongodb+srv://faculty_leave:leave_123@interviewforgeai.e9regcd.mongodb.net/faculty_leave_db?appName=InterviewForgeAI';
    const conn = await mongoose.connect(mongoURI);
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
