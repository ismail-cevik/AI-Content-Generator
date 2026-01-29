const mongoose = require('mongoose');

const TextAnalysisSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    originalText: {
        type: String,
        required: true
    },
    analysis: [{
        sentence: String,
        isCorrect: Boolean,
        corrections: [{
            original: String,
            corrected: String,
            explanation: String
        }]
    }],
    overallScore: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TextAnalysis', TextAnalysisSchema);