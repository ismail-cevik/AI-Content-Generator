const express = require('express');
const { generatePlacementTest, submitPlacementTest, getUserTests, submitPracticeTest, generatePracticeTest } = require('../controllers/testController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/placement', protect, generatePlacementTest);
router.post('/placement', protect, submitPlacementTest);
router.post('/generate', protect, generatePracticeTest);
router.post('/practice', protect, submitPracticeTest);
router.get('/history', protect, getUserTests);

module.exports = router;