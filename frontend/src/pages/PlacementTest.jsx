import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const PlacementTest = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/api/tests/placement', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQuestions(data.questions);
            setAnswers(new Array(data.questions.length).fill(null));
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (answerIndex) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answerIndex;
        setAnswers(newAnswers);
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const submitTest = async () => {
        if (answers.includes(null)) {
            alert('Please answer all questions before submitting.');
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('/api/tests/placement', 
                { answers },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setResult(data.data);
            // Refresh user data to get updated placementTestCompleted status
            await refreshUser();
        } catch (error) {
            console.error('Error submitting test:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Loading placement test...</div>
            </div>
        );
    }

    if (result) {
        return (
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-6 text-green-600">Test Completed!</h2>
                    <div className="space-y-4">
                        <p className="text-xl">Your English Level: <span className="font-bold text-indigo-600">{result.level}</span></p>
                        <p className="text-lg">Score: {result.score}/{questions.length} ({result.percentage}%)</p>
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="btn-primary mt-6"
                        >
                            Continue to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">English Placement Test</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        This test will determine your English proficiency level.
                    </p>
                    <div className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                            className="bg-indigo-600 h-2 rounded-full transition-all"
                            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Question {currentQuestion + 1} of {questions.length}
                    </p>
                </div>

                {questions[currentQuestion] && (
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-6">
                            {questions[currentQuestion].question}
                        </h3>
                        <div className="space-y-3">
                            {questions[currentQuestion].options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(index)}
                                    className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                                        answers[currentQuestion] === index
                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                            : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500'
                                    }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-between">
                    <button
                        onClick={prevQuestion}
                        disabled={currentQuestion === 0}
                        className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50"
                    >
                        Previous
                    </button>
                    
                    {currentQuestion === questions.length - 1 ? (
                        <button
                            onClick={submitTest}
                            disabled={submitting || answers[currentQuestion] === null}
                            className="btn-primary disabled:opacity-50"
                        >
                            {submitting ? 'Submitting...' : 'Submit Test'}
                        </button>
                    ) : (
                        <button
                            onClick={nextQuestion}
                            disabled={answers[currentQuestion] === null}
                            className="btn-primary disabled:opacity-50"
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlacementTest;