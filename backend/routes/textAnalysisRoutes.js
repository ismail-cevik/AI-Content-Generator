const express = require('express');
const { analyzeText, evaluatePronunciation, generatePronunciationSentences, getUserAnalyses } = require('../controllers/textAnalysisController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/analyze', protect, analyzeText);
router.post('/evaluate-pronunciation', evaluatePronunciation); // No auth required
router.post('/generate-pronunciation-sentences', generatePronunciationSentences); // No auth required
router.get('/history', protect, getUserAnalyses);

module.exports = router;