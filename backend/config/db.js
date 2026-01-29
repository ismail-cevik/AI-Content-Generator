const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai-content-generator', {
            // mongoose 6+ defaults
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection failed: ${error.message}`);
        console.log('Continuing without database...');
        // Don't exit, continue without DB for demo
    }
};

module.exports = connectDB;
