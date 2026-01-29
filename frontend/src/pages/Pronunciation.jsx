import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Mic, MicOff, Play, RotateCcw, Volume2, Loader } from 'lucide-react';
import api from '../utils/api';

const Pronunciation = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [topic, setTopic] = useState('');
    const [generatedSentences, setGeneratedSentences] = useState([]);
    const [currentSentence, setCurrentSentence] = useState('');
    const currentSentenceRef = useRef('');
    const [isRecording, setIsRecording] = useState(false);
    const [recordedText, setRecordedText] = useState('');
    const [feedback, setFeedback] = useState('');
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recognition, setRecognition] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [wordComparison, setWordComparison] = useState([]);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [accuracy, setAccuracy] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        // Load voices when component mounts
        const loadVoices = () => {
            if ('speechSynthesis' in window) {
                speechSynthesis.getVoices();
            }
        };
        
        loadVoices();
        if ('speechSynthesis' in window) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }
        
        // Initialize speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = false;
            recognitionInstance.lang = 'en-US';
            recognitionInstance.maxAlternatives = 1; // Get only best result
            
            recognitionInstance.onresult = (event) => {
                // Get the FINAL result with highest confidence
                let transcript = '';
                let confidence = 0;
                
                // Iterate through all results and find the final one with highest confidence
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        // Take the first alternative (highest confidence)
                        const result = event.results[i][0];
                        transcript = result.transcript;
                        confidence = result.confidence;
                        console.log(`Final result: "${transcript}" (confidence: ${(confidence * 100).toFixed(1)}%)`);
                    }
                }
                
                if (!transcript) {
                    // Fallback: if no final result, get the last result
                    transcript = event.results[event.results.length - 1][0].transcript;
                }
                
                setRecordedText(transcript);
                // Use the ref to get the current sentence value
                const originalSentence = currentSentenceRef.current;
                console.log('Speech recognition result:', {
                    transcript,
                    confidence: (confidence * 100).toFixed(1) + '%',
                    originalSentence,
                    originalEmpty: !originalSentence
                });
                provideFeedback(originalSentence, transcript);
                setIsListening(false);
            };
            
            recognitionInstance.onerror = (event) => {
                setIsListening(false);
                console.error('Speech recognition error:', event.error);
                setFeedback('Speech recognition error: ' + event.error + '. Please try again.');
            };
            
            recognitionInstance.onend = () => {
                setIsListening(false);
            };
            
            setRecognition(recognitionInstance);
        }
        
        generateSentence();
    }, []);

    const generateSentence = () => {
        const level = user?.languageLevel || 'A1';
        const sentences = {
            A1: [
                "I like to drink water.",
                "The cat is sleeping.",
                "I eat breakfast every day.",
                "She has a red car.",
                "We go to school together.",
                "My name is John.",
                "Do you speak English?",
                "Where is the bathroom?",
                "I am happy.",
                "This is a book.",
                "He plays football.",
                "They live in London.",
                "I have two sisters.",
                "What is your name?",
                "Nice to meet you."
            ],
            A2: [
                "I am going to the market today.",
                "She works in a big office building.",
                "We usually have dinner at seven.",
                "He likes to read books in the evening.",
                "They are planning a trip next month.",
                "Can you help me with my homework?",
                "I prefer coffee to tea.",
                "How much does this cost?",
                "The weather is very nice today.",
                "I have never been to France.",
                "What time does the store close?",
                "My favorite food is pizza.",
                "I would like to learn Spanish.",
                "How long have you lived here?",
                "Yesterday was a beautiful day."
            ],
            B1: [
                "I usually wake up early and prepare my breakfast.",
                "She decided to learn a new language this year.",
                "We enjoyed the movie even though it was quite long.",
                "He always checks his email before starting work.",
                "They moved to a different city for better opportunities.",
                "Although it rained, we went to the park anyway.",
                "I have been studying English for five years.",
                "If I had more time, I would travel around the world.",
                "The main reason I like this job is the salary.",
                "Despite the difficulties, they managed to finish the project.",
                "She is interested in both music and sports.",
                "The conference will take place next Tuesday.",
                "I think it would be better if we left earlier.",
                "By the time you arrive, I will have finished cooking.",
                "This is one of the most interesting books I have read."
            ],
            B2: [
                "I decided to stay home because the weather was getting worse.",
                "She has been working on this project for several months now.",
                "We should probably leave earlier to avoid the traffic.",
                "He explained the situation clearly so everyone could understand.",
                "They have been discussing the proposal since last week.",
                "The company's decision to expand into new markets was rather controversial.",
                "Had they been more careful, the accident would not have happened.",
                "It is crucial that we address this issue before it escalates further.",
                "Unless you study regularly, you won't be able to pass the exam.",
                "The more I think about it, the more I realize how complex this problem is.",
                "In light of recent developments, we need to reconsider our strategy.",
                "She approached the task with remarkable dedication and enthusiasm.",
                "The research suggests that this approach is more effective than previously thought.",
                "We must acknowledge that there are multiple perspectives on this issue.",
                "It appears that the government is considering new legislation on this matter."
            ],
            C1: [
                "I realized that speaking clearly helps people understand me better.",
                "She demonstrated remarkable patience while teaching the difficult concept.",
                "We need to consider all the factors before making this important decision.",
                "He has developed an effective approach to solving complex problems.",
                "They established a comprehensive plan to improve customer satisfaction.",
                "The implications of this discovery are profound and far-reaching.",
                "Notwithstanding the challenges we face, we remain optimistic about the future.",
                "The committee deliberated extensively before reaching a consensus.",
                "This phenomenon warrants further investigation by the scientific community.",
                "The proposal was subsequently modified to accommodate stakeholder concerns.",
                "We must acknowledge the inherent limitations of our current methodology.",
                "The organization has implemented a sophisticated system for quality assurance.",
                "These findings contradict the previously established paradigm in several ways.",
                "The speaker articulated a compelling argument for fundamental reform.",
                "It is imperative that we establish clear parameters for this initiative."
            ]
        };
        
        const levelSentences = sentences[level] || sentences.A1;
        const randomSentence = levelSentences[Math.floor(Math.random() * levelSentences.length)];
        setCurrentSentence(randomSentence);
        currentSentenceRef.current = randomSentence;
        setRecordedText('');
        setFeedback('');
        setWordComparison([]);
        setAccuracy(0);
    };

    // Generate sentences from AI based on topic
    const generateSentencesFromAI = async () => {
        if (!topic.trim()) {
            setFeedback('Please enter a topic first');
            return;
        }

        setIsGenerating(true);
        setFeedback('Generating sentences...');

        try {
            console.log('Requesting sentences for topic:', topic, 'level:', user?.languageLevel || 'A1');
            
            const response = await api.post('/text-analysis/generate-pronunciation-sentences', {
                topic: topic.trim(),
                level: user?.languageLevel || 'A1'
            });

            console.log('Generated sentences response:', response.data);
            
            const sentences = response.data.data.sentences;
            if (sentences && sentences.length > 0) {
                setGeneratedSentences(sentences);
                setTopic(''); // Clear input after generating
                
                // Set first sentence as current
                const firstSentence = sentences[0];
                setCurrentSentence(firstSentence);
                currentSentenceRef.current = firstSentence;
                setRecordedText('');
                setFeedback('Ready to practice! Listen and repeat.');
                setWordComparison([]);
                setAccuracy(0);
            } else {
                setFeedback('Failed to generate sentences. Please try again.');
            }
        } catch (error) {
            console.error('Error generating sentences:', error);
            setFeedback('Error: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsGenerating(false);
        }
    };

    // Select next sentence from generated list
    const selectNextGeneratedSentence = () => {
        if (generatedSentences.length === 0) {
            generateSentence();
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * generatedSentences.length);
        const newSentence = generatedSentences[randomIndex];
        setCurrentSentence(newSentence);
        currentSentenceRef.current = newSentence;
        setRecordedText('');
        setFeedback('');
        setWordComparison([]);
        setAccuracy(0);
    };

    const speakSentence = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(currentSentence);
            utterance.rate = 0.7;
            utterance.pitch = 1;
            utterance.volume = 1;
            utterance.lang = 'en-US';
            
            // Get English voice
            const voices = speechSynthesis.getVoices();
            const englishVoice = voices.find(voice => 
                voice.lang.startsWith('en') && voice.name.includes('US')
            ) || voices.find(voice => voice.lang.startsWith('en'));
            
            if (englishVoice) {
                utterance.voice = englishVoice;
            }
            
            speechSynthesis.speak(utterance);
        }
    };

    const startRecording = () => {
        if (recognition) {
            setIsListening(true);
            setRecordedText('');
            setFeedback('Listening... Speak now!');
            setWordComparison([]);
            setAccuracy(0);
            
            // Reset recognition to clear any previous state
            try {
                recognition.abort();
            } catch (e) {
                // Ignore abort errors
            }
            
            // Start fresh recognition
            recognition.start();
        } else {
            setFeedback('Speech recognition not supported in this browser.');
        }
    };

    const stopRecording = () => {
        if (recognition && isListening) {
            recognition.stop();
            setIsListening(false);
        }
    };

    const provideFeedback = async (original, spoken) => {
        // Validate that we have both sentences
        if (!original || !original.trim()) {
            setFeedback('Error: No original sentence');
            return;
        }
        
        if (!spoken || !spoken.trim()) {
            setFeedback('Error: Please record something');
            return;
        }

        setIsEvaluating(true);
        setFeedback('Evaluating your pronunciation...');
        
        try {
            console.log('Sending request with:', {
                originalSentence: original,
                spokenText: spoken
            });

            // Call the AI-powered evaluation endpoint
            const response = await api.post('/text-analysis/evaluate-pronunciation', {
                originalSentence: original,
                spokenText: spoken
            });

            console.log('API Response:', response);
            const evaluation = response.data.data;
            
            // Set accuracy score
            setAccuracy(evaluation.accuracy || 0);
            
            // Set word comparison from AI evaluation
            if (evaluation.wordByWordComparison && evaluation.wordByWordComparison.length > 0) {
                setWordComparison(evaluation.wordByWordComparison);
            }
            
            // Set feedback based on accuracy with the requested thresholds
            if (evaluation.accuracy >= 95) {
                setFeedback('Perfect! 🎉 Excellent pronunciation!');
            } else if (evaluation.accuracy >= 80) {
                setFeedback('Excellent! 👏 Great job!');
            } else if (evaluation.accuracy >= 60) {
                setFeedback('Good job! 👍 ' + (evaluation.feedback || ''));
            } else if (evaluation.accuracy >= 40) {
                setFeedback('Keep practicing! 💪 ' + (evaluation.feedback || ''));
            } else {
                setFeedback('Try again! 🔄 ' + (evaluation.feedback || ''));
            }
            
            console.log('Pronunciation evaluation:', evaluation);
        } catch (error) {
            console.error('Error evaluating pronunciation:', error);
            console.error('Error response:', error.response?.data);
            const errorMsg = error.response?.data?.message || error.message;
            setFeedback('Unable to evaluate. Error: ' + errorMsg);
            setAccuracy(0);
        } finally {
            setIsEvaluating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{t('pronunciationPractice')}</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    {t('improveYourPronunciation')}
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                {/* Topic Input Section */}
                <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg border border-blue-200 dark:border-blue-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Generate Custom Sentences</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Enter a topic (e.g., "space", "cooking", "technology") to generate AI-created sentences at your level</p>
                    
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && generateSentencesFromAI()}
                            placeholder="Enter a topic..."
                            disabled={isGenerating}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        />
                        <button
                            onClick={generateSentencesFromAI}
                            disabled={isGenerating || !topic.trim()}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader className="h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                'Generate'
                            )}
                        </button>
                    </div>

                    {generatedSentences.length > 0 && (
                        <p className="mt-3 text-sm text-blue-700 dark:text-blue-300">
                            ✓ {generatedSentences.length} sentences generated for "{topic}"
                        </p>
                    )}
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Practice Sentence</h2>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                        <p className="text-2xl font-medium text-gray-900 dark:text-white leading-relaxed">
                            {currentSentence}
                        </p>
                    </div>
                    
                    <div className="flex justify-center space-x-4 mb-6">
                        <button 
                            onClick={speakSentence}
                            className="btn-secondary flex items-center space-x-2"
                        >
                            <Volume2 className="h-4 w-4" />
                            <span>Listen</span>
                        </button>
                        
                        <button 
                            onClick={generatedSentences.length > 0 ? selectNextGeneratedSentence : generateSentence}
                            className="btn-secondary flex items-center space-x-2"
                        >
                            <RotateCcw className="h-4 w-4" />
                            <span>New Sentence</span>
                        </button>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Your Turn</h3>
                    
                    {!isListening ? (
                        <button 
                            onClick={startRecording}
                            className="btn-primary flex items-center space-x-2 mx-auto"
                        >
                            <Mic className="h-5 w-5" />
                            <span>Start Recording</span>
                        </button>
                    ) : (
                        <button 
                            onClick={stopRecording}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
                        >
                            <MicOff className="h-5 w-5" />
                            <span>Stop Recording</span>
                        </button>
                    )}
                    
                    {isListening && (
                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-400 rounded-lg animate-pulse">
                            <p className="text-blue-700 dark:text-blue-300 font-semibold flex items-center justify-center gap-2">
                                <span className="inline-block w-3 h-3 bg-blue-500 rounded-full animate-bounce"></span>
                                Listening... Speak now! Click Stop when done.
                            </p>
                        </div>
                    )}
                </div>

                {recordedText && (
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Your pronunciation:</h4>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div className="flex flex-wrap gap-1 text-lg leading-relaxed">
                                {recordedText.toLowerCase().replace(/[.,!?;:"']/g, '').split(' ').map((word, index) => {
                                    // Determine if word is correct based on accuracy score
                                    // If accuracy is high, assume word is correct
                                    let isCorrect = false;
                                    
                                    if (accuracy >= 80) {
                                        // High accuracy - show all words as correct (green)
                                        isCorrect = true;
                                    } else if (accuracy >= 60) {
                                        // Good accuracy - mostly correct, but show some as red
                                        const comparison = wordComparison[index];
                                        isCorrect = comparison?.match || comparison?.isCorrect || false;
                                    } else if (accuracy >= 40) {
                                        // Medium accuracy - use word comparison
                                        const comparison = wordComparison[index];
                                        isCorrect = comparison?.match || comparison?.isCorrect || false;
                                    } else {
                                        // Low accuracy - most words are wrong
                                        const comparison = wordComparison[index];
                                        isCorrect = comparison?.match || comparison?.isCorrect || false;
                                    }
                                    
                                    return (
                                        <span 
                                            key={index}
                                            className={`px-3 py-1 rounded font-medium ${
                                                accuracy > 0
                                                    ? isCorrect
                                                        ? 'bg-green-300 dark:bg-green-600 text-green-900 dark:text-white'
                                                        : 'bg-red-300 dark:bg-red-600 text-red-900 dark:text-white'
                                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                                            }`}
                                        >
                                            {word}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {isEvaluating && (
                    <div className="text-center mb-6">
                        <div className="flex justify-center items-center gap-2">
                            <Loader className="h-5 w-5 animate-spin text-blue-500" />
                            <p className="text-blue-600 dark:text-blue-400">Evaluating your pronunciation...</p>
                        </div>
                    </div>
                )}

                {feedback && !isEvaluating && (
                    <div className="text-center">
                        <div className={`rounded-lg p-4 mb-4 ${
                            accuracy >= 85 ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300' :
                            accuracy >= 75 ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300' :
                            'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                        }`}>
                            <p className="font-medium text-lg">{feedback}</p>
                            {accuracy > 0 && (
                                <p className="text-sm mt-2">Accuracy: {accuracy}%</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-indigo-700 dark:text-indigo-300 mb-3">
                    Pronunciation Tips
                </h3>
                <ul className="text-sm text-indigo-600 dark:text-indigo-400 space-y-2">
                    <li>• Speak slowly and clearly</li>
                    <li>• Make sure you're in a quiet environment</li>
                    <li>• Hold the microphone close to your mouth</li>
                    <li>• Practice the sentence a few times before recording</li>
                    <li>• Focus on pronouncing each word distinctly</li>
                </ul>
            </div>
        </div>
    );
};

export default Pronunciation;