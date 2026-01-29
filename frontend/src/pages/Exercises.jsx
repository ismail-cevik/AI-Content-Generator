import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const Exercises = () => {
    const [exerciseHistory, setExerciseHistory] = useState([]);
    const [currentExercise, setCurrentExercise] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [selectedBlank, setSelectedBlank] = useState(null);
    const [availableWords, setAvailableWords] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const { t } = useLanguage();

    useEffect(() => {
        fetchExerciseHistory();
    }, []);

    const fetchExerciseHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:5001/api/exercises/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExerciseHistory(data.data || []);
        } catch (error) {
            console.error('Error fetching exercise history:', error);
            setExerciseHistory([]);
        }
    };

    const startExercise = async (level = null) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('http://localhost:5001/api/exercises/generate', 
                { level: level || user?.languageLevel || 'A1' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (data.success && data.data) {
                setCurrentExercise(data.data);
                setUserAnswers(new Array(data.data.blanks.length).fill(''));
                setAvailableWords([...data.data.words]);
                setShowResults(false);
                setSelectedBlank(null);
            }
        } catch (error) {
            console.error('Error generating exercise:', error);
        } finally {
            setLoading(false);
        }
    };

    const selectBlank = (blankIndex) => {
        if (!showResults && userAnswers[blankIndex] === '') {
            setSelectedBlank(blankIndex);
        }
    };

    const selectWord = (word) => {
        if (selectedBlank !== null) {
            const newAnswers = [...userAnswers];
            newAnswers[selectedBlank] = word;
            setUserAnswers(newAnswers);
            
            const newAvailableWords = availableWords.filter(w => w !== word);
            setAvailableWords(newAvailableWords);
            setSelectedBlank(null);
        }
    };

    const removeWord = (blankIndex) => {
        const word = userAnswers[blankIndex];
        if (word && !showResults) {
            const newAnswers = [...userAnswers];
            newAnswers[blankIndex] = '';
            setUserAnswers(newAnswers);
            
            setAvailableWords([...availableWords, word]);
        }
    };

    const submitExercise = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5001/api/exercises/submit', {
                type: 'click-fill',
                answers: userAnswers,
                exerciseData: currentExercise,
                level: user?.languageLevel || 'A1'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setShowResults(true);
            fetchExerciseHistory();
        } catch (error) {
            console.error('Error submitting exercise:', error);
        }
    };

    const resetExercise = () => {
        setCurrentExercise(null);
        setShowResults(false);
        setUserAnswers([]);
        setAvailableWords([]);
        setSelectedBlank(null);
    };

    const renderTextWithBlanks = () => {
        if (!currentExercise) return '';
        
        let text = currentExercise.text;
        let blankIndex = 0;
        
        return text.split('___').map((part, index) => (
            <span key={index}>
                {part}
                {index < currentExercise.blanks.length && (
                    <span
                        className={`inline-block min-w-[120px] h-10 mx-2 px-3 py-2 border-2 rounded-lg text-center cursor-pointer transition-colors ${
                            selectedBlank === blankIndex
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-300'
                                : userAnswers[blankIndex] 
                                    ? showResults
                                        ? userAnswers[blankIndex] === currentExercise.blanks[blankIndex].correctAnswer
                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                            : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                        : 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                                    : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 bg-gray-50 dark:bg-gray-700'
                        }`}
                        onClick={() => userAnswers[blankIndex] ? removeWord(blankIndex) : selectBlank(blankIndex)}
                    >
                        {userAnswers[blankIndex] || t('clickToFill')}
                        {showResults && userAnswers[blankIndex] !== currentExercise.blanks[blankIndex].correctAnswer && (
                            <div className="text-xs text-green-600 mt-1">
                                {t('correct')}: {currentExercise.blanks[blankIndex].correctAnswer}
                            </div>
                        )}
                        {(() => blankIndex++)()}
                    </span>
                )}
            </span>
        ));
    };

    if (showResults) {
        const score = userAnswers.filter((answer, index) => 
            answer === currentExercise.blanks[index].correctAnswer
        ).length;
        const percentage = Math.round((score / currentExercise.blanks.length) * 100);

        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{t('exerciseResults')}</h2>
                        <div className="text-6xl font-bold text-indigo-600 mb-2">
                            {percentage}%
                        </div>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            {score} {t('outOfCorrect')} {currentExercise.blanks.length} {t('correct').toLowerCase()}
                        </p>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('review')}:</h3>
                        <div className="text-lg leading-relaxed p-6 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                            {renderTextWithBlanks()}
                        </div>
                    </div>

                    <div className="text-center space-x-4">
                        <button onClick={resetExercise} className="btn-primary">
                            {t('tryAnotherExercise')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (currentExercise) {
        const allFilled = userAnswers.every(answer => answer !== '');
        
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{t('clickToFill')} {t('exercises')}</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            {selectedBlank !== null ? 
                                `${t('clickToFill')} ${selectedBlank + 1}. Select a word below.` :
                                'Click on a blank to select it, then click a word to fill it.'
                            }
                        </p>
                    </div>

                    <div className="mb-8">
                        <div className="text-lg leading-relaxed p-6 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                            {renderTextWithBlanks()}
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{t('availableWords')}:</h3>
                        <div className="flex flex-wrap gap-3">
                            {availableWords.map((word, index) => (
                                <button
                                    key={`${word}-${index}`}
                                    onClick={() => selectWord(word)}
                                    disabled={selectedBlank === null}
                                    className={`px-4 py-2 rounded-lg transition-colors ${
                                        selectedBlank !== null 
                                            ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 cursor-pointer'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    {word}
                                </button>
                            ))}
                        </div>
                        {selectedBlank !== null && (
                            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                                Filling blank {selectedBlank + 1}. Click a word above.
                            </p>
                        )}
                    </div>

                    <div className="text-center">
                        <button 
                            onClick={submitExercise}
                            disabled={!allFilled}
                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t('submitExercise')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{t('interactiveExercises')}</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    {t('practiceWithDragDrop')}
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('startNewExercise')}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {t('chooseDifficulty')}
                    </p>
                    <div className="space-y-3">
                        <button 
                            onClick={() => startExercise('A1')} 
                            disabled={loading}
                            className="w-full btn-secondary disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            <span>{t('beginner')} (A1)</span>
                        </button>
                        <button 
                            onClick={() => startExercise('A2')} 
                            disabled={loading}
                            className="w-full btn-secondary disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            <span>{t('elementary')} (A2)</span>
                        </button>
                        <button 
                            onClick={() => startExercise('B1')} 
                            disabled={loading}
                            className="w-full btn-secondary disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            <span>{t('intermediate')} (B1)</span>
                        </button>
                        <button 
                            onClick={() => startExercise('B2')} 
                            disabled={loading}
                            className="w-full btn-secondary disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            <span>{t('upperIntermediate')} (B2)</span>
                        </button>
                        <button 
                            onClick={() => startExercise()} 
                            disabled={loading}
                            className="w-full btn-primary disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            <span>{t('myLevel')} ({user?.languageLevel || 'A1'})</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('exerciseHistory')}</h2>
                    {exerciseHistory.length > 0 ? (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {exerciseHistory.slice(0, 5).map((exercise) => (
                                <div key={exercise._id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{exercise.type} Exercise</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(exercise.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-indigo-600">
                                            {Math.round((exercise.score / exercise.totalItems) * 100)}%
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {exercise.score}/{exercise.totalItems}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">{t('noExercisesCompleted')}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Exercises;