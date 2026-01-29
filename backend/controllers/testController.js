const Test = require('../models/Test');
const User = require('../models/User');
const openai = require("../config/openai");

// Generate placement test
exports.generatePlacementTest = async (req, res) => {
    try {
        const questions = [
            {
                question: "What ___ your name?",
                options: ["is", "are", "am", "be"],
                correctAnswer: 0
            },
            {
                question: "I ___ from Turkey.",
                options: ["am", "is", "are", "be"],
                correctAnswer: 0
            },
            {
                question: "She ___ to school every day.",
                options: ["go", "goes", "going", "went"],
                correctAnswer: 1
            },
            {
                question: "We ___ watching TV now.",
                options: ["is", "am", "are", "be"],
                correctAnswer: 2
            },
            {
                question: "I have ___ this book.",
                options: ["read", "reading", "reads", "to read"],
                correctAnswer: 0
            }
        ];

        res.json({ success: true, questions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Generate practice test with AI
exports.generatePracticeTest = async (req, res) => {
    try {
        const { level } = req.body;
        
        const prompt = `Create 5 multiple choice English grammar questions for ${level} level students. 
Return ONLY a JSON array with this exact format:
[
  {
    "question": "Question text with blank ___",
    "options": ["option1", "option2", "option3", "option4"],
    "correctAnswer": 0
  }
]
Make questions appropriate for ${level} level difficulty.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are an English teacher creating grammar tests. Return only valid JSON." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7
        });

        let questions;
        try {
            questions = JSON.parse(response.choices[0].message.content);
        } catch (parseError) {
            // Fallback to static questions if AI response is not valid JSON
            questions = [
                {
                    question: "Choose the correct form: I ___ to the store yesterday.",
                    options: ["go", "went", "going", "goes"],
                    correctAnswer: 1
                },
                {
                    question: "What is the past tense of 'eat'?",
                    options: ["ate", "eated", "eaten", "eating"],
                    correctAnswer: 0
                }
            ];
        }

        res.json({ success: true, questions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Submit placement test
exports.submitPlacementTest = async (req, res) => {
    try {
        const { answers } = req.body;
        const questions = [
            { correctAnswer: 0 },
            { correctAnswer: 0 },
            { correctAnswer: 1 },
            { correctAnswer: 2 },
            { correctAnswer: 0 }
        ];

        let score = 0;
        answers.forEach((answer, index) => {
            if (answer === questions[index].correctAnswer) score++;
        });

        const percentage = (score / questions.length) * 100;
        let level = 'A1';
        if (percentage >= 80) level = 'C1';
        else if (percentage >= 60) level = 'B2';
        else if (percentage >= 40) level = 'B1';
        else if (percentage >= 20) level = 'A2';

        await User.findByIdAndUpdate(req.user.id, {
            placementTestCompleted: true,
            placementTestScore: percentage,
            languageLevel: level
        });

        const test = await Test.create({
            user: req.user.id,
            type: 'placement',
            questions: questions.map((q, i) => ({
                question: `Question ${i + 1}`,
                correctAnswer: q.correctAnswer,
                userAnswer: answers[i],
                isCorrect: answers[i] === q.correctAnswer
            })),
            score,
            totalQuestions: questions.length,
            percentage,
            level
        });

        res.json({ success: true, data: { score, percentage, level, test } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user tests
exports.getUserTests = async (req, res) => {
    try {
        const tests = await Test.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json({ success: true, data: tests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Submit practice test
exports.submitPracticeTest = async (req, res) => {
    try {
        const { questions, score, totalQuestions, percentage, level } = req.body;

        const test = await Test.create({
            user: req.user.id,
            type: 'practice',
            questions,
            score,
            totalQuestions,
            percentage,
            level
        });

        res.json({ success: true, data: test });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};