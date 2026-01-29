const express = require('express');
const { generateDragDropExercise, submitExercise, getUserExercises } = require('../controllers/exerciseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/generate', protect, generateDragDropExercise);
router.post('/submit', protect, submitExercise);
router.get('/history', protect, getUserExercises);

module.exports = router;