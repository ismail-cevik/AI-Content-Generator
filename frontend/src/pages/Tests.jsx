import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';
import { CheckCircle, XCircle, RotateCcw, Loader2 } from 'lucide-react';

const Tests = () => {
    const [testHistory, setTestHistory] = useState([]);
    const [currentTest, setCurrentTest] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [testResult, setTestResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const { user } = useAuth();
    const { t } = useLanguage();

    useEffect(() => {
        fetchTestHistory();
    }, []);

    const fetchTestHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:5001/api/tests/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTestHistory(data.data);
        } catch (error) {
            console.error('Error fetching test history:', error);
        }
    };

    const startPracticeTest = async () => {
        setGenerating(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('http://localhost:5001/api/tests/generate', 
                { level: user?.languageLevel || 'A1' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setCurrentTest({ questions: data.questions, type: 'practice' });
            setAnswers(new Array(data.questions.length).fill(null));
            setCurrentQuestion(0);
            setShowResults(false);
        } catch (error) {
            console.error('Error generating test:', error);
            alert('Test oluşturulurken hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setGenerating(false);
        }
    };

    const handleAnswer = (answerIndex) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answerIndex;
        setAnswers(newAnswers);

        // Anında feedback göster
        setTimeout(() => {
            if (currentQuestion < currentTest.questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
            } else {
                finishTest();
            }
        }, 2000); // 2 saniye bekle
    };

    const finishTest = async () => {
        let score = 0;
        const questionsWithAnswers = currentTest.questions.map((q, index) => {
            const isCorrect = answers[index] === q.correctAnswer;
            if (isCorrect) score++;
            return {
                ...q,
                userAnswer: answers[index],
                isCorrect
            };
        });

        const percentage = Math.round((score / currentTest.questions.length) * 100);
        
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5001/api/tests/practice', {
                questions: questionsWithAnswers,
                score,
                totalQuestions: currentTest.questions.length,
                percentage,
                level: user?.languageLevel || 'A1'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Error saving test:', error);
        }

        setTestResult({ score, percentage, questions: questionsWithAnswers });
        setShowResults(true);
        fetchTestHistory();
    };

    const resetTest = () => {
        setCurrentTest(null);
        setShowResults(false);
        setTestResult(null);
        setCurrentQuestion(0);
        setAnswers([]);
    };

    if (showResults && testResult) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{t('testResults')}</h2>
                        <div className="text-6xl font-bold text-indigo-600 mb-2">
                            {testResult.percentage}%
                        </div>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            {testResult.score} {t('outOfCorrect')} {testResult.questions.length} {t('correct').toLowerCase()}
                        </p>
                    </div>

                    <div className="space-y-6 mb-8">
                        {testResult.questions.map((q, index) => (
                            <div key={index} className="border dark:border-gray-600 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    {q.isCorrect ? (
                                        <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                                    ) : (
                                        <XCircle className="h-6 w-6 text-red-500 mt-1" />
                                    )}
                                    <div className="flex-1">
                                        <p className="font-semibold mb-2 text-gray-900 dark:text-white">{q.question}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Cevabınız: <span className={q.isCorrect ? 'text-green-600' : 'text-red-600'}>
                                                {q.options[q.userAnswer]}
                                            </span>
                                        </p>
                                        {!q.isCorrect && (
                                            <p className="text-sm text-green-600">
                                                Doğru cevap: {q.options[q.correctAnswer]}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <button onClick={resetTest} className="btn-primary">
                            {t('takeAnotherTest')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (currentTest) {
        const question = currentTest.questions[currentQuestion];
        const hasAnswered = answers[currentQuestion] !== null;
        
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('practiceTest')}</h2>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {currentQuestion + 1} / {currentTest.questions.length}
                            </span>
                        </div>
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${((currentQuestion + 1) / currentTest.questions.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Soru ve Cevaplar */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">{question.question}</h3>
                        <div className="space-y-3">
                            {question.options.map((option, index) => {
                                let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-colors ";
                                
                                if (hasAnswered) {
                                    if (index === question.correctAnswer) {
                                        buttonClass += "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400";
                                    } else if (index === answers[currentQuestion]) {
                                        buttonClass += "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400";
                                    } else {
                                        buttonClass += "border-gray-200 dark:border-gray-600 opacity-50 text-gray-900 dark:text-white";
                                    }
                                } else {
                                    buttonClass += "border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700";
                                }

                                return (
                                    <button
                                        key={index}
                                        onClick={() => !hasAnswered && handleAnswer(index)}
                                        disabled={hasAnswered}
                                        className={buttonClass}
                                    >
                                        {option}
                                    </button>
                                );
                            })}
                        </div>
                        {hasAnswered && (
                            <div className="mt-4 text-center">
                                <p className="text-lg font-semibold">
                                    {answers[currentQuestion] === question.correctAnswer ? (
                                        <span className="text-green-600 dark:text-green-400">✓ {t('correct')}!</span>
                                    ) : (
                                        <span className="text-red-600 dark:text-red-400">✗ {t('incorrect')}!</span>
                                    )}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{t('englishTests')}</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    {t('testYourKnowledge')}
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('startNewTest')}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {t('testYourKnowledge')}
                    </p>
                    <button 
                        onClick={startPracticeTest} 
                        disabled={generating}
                        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        {generating ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>{t('generatingTest')}</span>
                            </>
                        ) : (
                            <span>{t('startNewTest')}</span>
                        )}
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('testHistory')}</h2>
                    {testHistory.length > 0 ? (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {testHistory.slice(0, 5).map((test) => (
                                <div key={test._id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{test.type} Test</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(test.createdAt).toLocaleDateString('tr-TR')}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-indigo-600">{test.percentage}%</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {test.score}/{test.totalQuestions}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">{t('noTestsTaken')}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tests;