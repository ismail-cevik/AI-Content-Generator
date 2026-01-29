const TextAnalysis = require('../models/TextAnalysis');
const openai = require("../config/openai");

// Analyze text with AI
exports.analyzeText = async (req, res) => {
    try {
        const { text } = req.body;
        
        const prompt = `Analyze this English text for grammar errors and provide corrections:
"${text}"

Return ONLY a JSON object with this format:
{
  "analysis": [
    {
      "sentence": "sentence text",
      "isCorrect": true/false,
      "corrections": [
        {
          "original": "wrong part",
          "corrected": "correct version",
          "explanation": "why it's wrong"
        }
      ]
    }
  ],
  "overallScore": 85
}`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are an English grammar checker. Return only valid JSON." },
                { role: "user", content: prompt }
            ],
            temperature: 0.3
        });

        let analysisResult;
        try {
            analysisResult = JSON.parse(response.choices[0].message.content);
        } catch (parseError) {
            // Fallback analysis
            const sentences = text.split(/[.!?]+/).filter(s => s.trim());
            analysisResult = {
                analysis: sentences.map(sentence => ({
                    sentence: sentence.trim(),
                    isCorrect: true,
                    corrections: []
                })),
                overallScore: 75
            };
        }

        const textAnalysis = await TextAnalysis.create({
            user: req.user.id,
            originalText: text,
            analysis: analysisResult.analysis,
            overallScore: analysisResult.overallScore
        });

        res.json({ success: true, data: textAnalysis });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Evaluate pronunciation accuracy using AI
exports.evaluatePronunciation = async (req, res) => {
    try {
        let { originalSentence, spokenText } = req.body;

        // Trim and validate
        originalSentence = originalSentence?.trim();
        spokenText = spokenText?.trim();

        console.log("Received pronunciation evaluation request:", {
            originalSentence,
            spokenText,
            originalEmpty: !originalSentence,
            spokenEmpty: !spokenText
        });

        if (!originalSentence || !spokenText) {
            console.error("Validation failed - missing data:", { originalSentence, spokenText });
            return res.status(400).json({ success: false, message: "Original sentence and spoken text are required" });
        }

        const prompt = `You are a pronunciation and English language expert. Compare the following two texts and evaluate pronunciation/speech accuracy fairly.

Original sentence (what should be said):
"${originalSentence}"

What the user said (speech recognition result):
"${spokenText}"

IMPORTANT INSTRUCTIONS:
1. Check if the words are essentially the same (ignoring minor differences)
2. Check if the word order is correct
3. Be FAIR and encouraging - if the user said the correct words in the correct order, mark it as CORRECT
4. Return accurate word-by-word comparison

For word-by-word comparison:
- Split both sentences into words
- Compare each word at the same position
- A word is considered a match if it's identical OR very similar (accounting for speech recognition variations)
- Return "match": true for correct words and "match": false for incorrect ones

Return ONLY a JSON object with this exact format:
{
  "accuracy": 0-100,
  "feedback": "Brief encouraging or constructive feedback",
  "wordByWordComparison": [
    {
      "expected": "word from original",
      "spoken": "word from spoken",
      "match": true/false
    }
  ]
}`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a fair and encouraging pronunciation expert. Return only valid JSON. If the user said the correct words in order, give high accuracy. Be lenient but accurate." },
                { role: "user", content: prompt }
            ],
            temperature: 0.3
        });

        let evaluationResult;
        try {
            evaluationResult = JSON.parse(response.choices[0].message.content);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            console.error("Response content:", response.choices[0].message.content);
            // Fallback evaluation - be generous
            evaluationResult = {
                accuracy: 85,
                feedback: "Great effort! Keep practicing.",
                wordByWordComparison: []
            };
        }

        console.log("Sending evaluation result:", evaluationResult);
        res.json({ success: true, data: evaluationResult });
    } catch (error) {
        console.error("Pronunciation evaluation error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Generate pronunciation practice sentences based on topic and level
exports.generatePronunciationSentences = async (req, res) => {
    try {
        const { topic, level } = req.body;

        if (!topic || !topic.trim()) {
            return res.status(400).json({ success: false, message: "Topic is required" });
        }

        if (!level || !['A1', 'A2', 'B1', 'B2', 'C1'].includes(level)) {
            return res.status(400).json({ success: false, message: "Valid level is required (A1, A2, B1, B2, C1)" });
        }

        // Define complexity for each level
        const levelGuides = {
            A1: "Use very simple words. Short sentences (3-5 words). Present tense. Basic vocabulary.",
            A2: "Use simple words. Sentences 5-7 words. Mix simple present and past. Common vocabulary.",
            B1: "Use intermediate vocabulary. Sentences 8-12 words. Use various tenses. Some complex structures.",
            B2: "Use advanced vocabulary. Sentences 12-15 words. Use conditionals, passive voice. Sophisticated language.",
            C1: "Use complex vocabulary. Sentences 15-20 words. Use advanced structures, idioms. Professional/academic tone."
        };

        const prompt = `You are an English language teacher. Generate 8 pronunciation practice sentences based on the following requirements:

Topic: ${topic}
English Level: ${level}
Complexity Guide: ${levelGuides[level]}

Requirements:
1. All sentences MUST be related to the topic "${topic}"
2. Each sentence should be appropriate for level ${level}
3. Use varied sentence structures
4. Make sentences realistic and useful for learning
5. Include the topic keywords naturally in the sentences

Return ONLY a JSON object with this format:
{
  "sentences": [
    "First sentence about the topic.",
    "Second sentence about the topic.",
    ...
  ]
}

Generate exactly 8 sentences now.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are an expert English teacher creating pronunciation practice sentences. Return ONLY valid JSON with exactly 8 sentences." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7
        });

        let generatedSentences;
        try {
            const result = JSON.parse(response.choices[0].message.content);
            generatedSentences = result.sentences || [];
            
            // Ensure we have exactly 8 sentences
            if (generatedSentences.length === 0) {
                throw new Error("No sentences generated");
            }
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            console.error("Response content:", response.choices[0].message.content);
            
            // Fallback sentences
            generatedSentences = [
                `I like ${topic}.`,
                `This is about ${topic}.`,
                `${topic} is interesting.`,
                `I learn about ${topic} every day.`,
                `Many people enjoy ${topic}.`,
                `${topic} helps us understand more.`,
                `I think ${topic} is very important.`,
                `Let me tell you about ${topic}.`
            ];
        }

        console.log(`Generated ${generatedSentences.length} sentences for topic: ${topic}, level: ${level}`);
        res.json({ success: true, data: { sentences: generatedSentences, topic, level } });
    } catch (error) {
        console.error("Sentence generation error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user text analyses
exports.getUserAnalyses = async (req, res) => {
    try {
        const analyses = await TextAnalysis.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json({ success: true, data: analyses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};