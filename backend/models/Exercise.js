const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['drag-drop', 'fill-blank', 'multiple-choice'],
        required: true
    },
    content: {
        text: String,
        blanks: [{
            position: Number,
            correctAnswer: String,
            userAnswer: String,
            isCorrect: Boolean
        }],
        words: [String]
    },
    score: {
        type: Number,
        required: true
    },
    totalItems: {
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

module.exports = mongoose.model('Exercise', ExerciseSchema);