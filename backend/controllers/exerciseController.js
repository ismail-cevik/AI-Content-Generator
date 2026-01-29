const Exercise = require('../models/Exercise');

// Generate drag-drop exercise
exports.generateDragDropExercise = async (req, res) => {
    try {
        const { level } = req.body;
        
        const exercises = {
            A1: {
                text: "I ___ to school every day. She ___ her homework.",
                blanks: [
                    { position: 0, correctAnswer: "go" },
                    { position: 1, correctAnswer: "does" }
                ],
                words: ["go", "does", "make", "have", "is", "are"]
            },
            A2: {
                text: "Yesterday I ___ to the park. We ___ a great time.",
                blanks: [
                    { position: 0, correctAnswer: "went" },
                    { position: 1, correctAnswer: "had" }
                ],
                words: ["went", "had", "go", "have", "was", "were"]
            },
            B1: {
                text: "If I ___ more time, I ___ travel around the world.",
                blanks: [
                    { position: 0, correctAnswer: "had" },
                    { position: 1, correctAnswer: "would" }
                ],
                words: ["had", "would", "have", "will", "could", "should"]
            },
            B2: {
                text: "The project ___ completed by next month if we ___ enough resources.",
                blanks: [
                    { position: 0, correctAnswer: "will be" },
                    { position: 1, correctAnswer: "have" }
                ],
                words: ["will be", "have", "are", "get", "would be", "had"]
            }
        };

        const exercise = exercises[level] || exercises.A1;
        res.json({ success: true, data: exercise });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Submit exercise
exports.submitExercise = async (req, res) => {
    try {
        const { type, answers, exerciseData } = req.body;
        
        let score = 0;
        const blanks = exerciseData.blanks.map((blank, index) => {
            const isCorrect = answers[index] === blank.correctAnswer;
            if (isCorrect) score++;
            
            return {
                position: blank.position,
                correctAnswer: blank.correctAnswer,
                userAnswer: answers[index],
                isCorrect
            };
        });

        const exercise = await Exercise.create({
            user: req.user.id,
            type,
            content: {
                text: exerciseData.text,
                blanks,
                words: exerciseData.words
            },
            score,
            totalItems: exerciseData.blanks.length,
            level: req.body.level
        });

        res.json({ success: true, data: exercise });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user exercises
exports.getUserExercises = async (req, res) => {
    try {
        const exercises = await Exercise.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json({ success: true, data: exercises });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};