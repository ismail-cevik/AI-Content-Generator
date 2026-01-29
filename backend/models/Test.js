const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['placement', 'practice', 'quiz'],
        required: true
    },
    questions: [{
        question: String,
        options: [String],
        correctAnswer: Number,
        userAnswer: Number,
        isCorrect: Boolean
    }],
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    level: {
        type: String,
        enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Test', TestSchema);