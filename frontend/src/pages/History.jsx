import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, FileText, TestTube, Dumbbell, FileSearch, BookOpen, Eye } from 'lucide-react';

const History = () => {
    const [contentHistory, setContentHistory] = useState([]);
    const [testHistory, setTestHistory] = useState([]);
    const [exerciseHistory, setExerciseHistory] = useState([]);
    const [analysisHistory, setAnalysisHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('content');
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetchAllHistory();
    }, []);

    const fetchAllHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            const [contentRes, testRes, exerciseRes, analysisRes] = await Promise.all([
                axios.get('/api/content/history', config),
                axios.get('/api/tests/history', config),
                axios.get('/api/exercises/history', config),
                axios.get('/api/text-analysis/history', config)
            ]);
            
            setContentHistory(contentRes.data.success ? contentRes.data.data : []);
            setTestHistory(testRes.data.success ? testRes.data.data : []);
            setExerciseHistory(exerciseRes.data.success ? exerciseRes.data.data : []);
            setAnalysisHistory(analysisRes.data.success ? analysisRes.data.data : []);
        } catch (error) {
            console.error('Failed to fetch history', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (item, type) => {
        setSelectedItem({ ...item, type });
    };

    const closeModal = () => {
        setSelectedItem(null);
    };

    const renderContentCard = (item) => (
        <div key={item._id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">{item.title}</h3>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> {new Date(item.createdAt).toLocaleDateString()}</span>
                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide">{item.level}</span>
                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide">{item.type}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                            {item.body?.substring(0, 150)}...
                        </p>
                    </div>
                </div>
                <button 
                    onClick={() => openModal(item, 'content')}
                    className="btn-secondary flex items-center space-x-1"
                >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                </button>
            </div>
        </div>
    );

    const renderTestCard = (item) => (
        <div key={item._id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                        <TestTube className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">{item.type} Test</h3>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> {new Date(item.createdAt).toLocaleDateString()}</span>
                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide">{item.level}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-2xl font-bold text-indigo-600">{item.percentage}%</span>
                            <span className="text-gray-600 dark:text-gray-300">{item.score}/{item.totalQuestions} correct</span>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => openModal(item, 'test')}
                    className="btn-secondary flex items-center space-x-1"
                >
                    <Eye className="h-4 w-4" />
                    <span>Review</span>
                </button>
            </div>
        </div>
    );

    const renderExerciseCard = (item) => (
        <div key={item._id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                        <Dumbbell className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">{item.type} Exercise</h3>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> {new Date(item.createdAt).toLocaleDateString()}</span>
                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide">{item.level}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-2xl font-bold text-indigo-600">{Math.round((item.score / item.totalItems) * 100)}%</span>
                            <span className="text-gray-600 dark:text-gray-300">{item.score}/{item.totalItems} correct</span>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => openModal(item, 'exercise')}
                    className="btn-secondary flex items-center space-x-1"
                >
                    <Eye className="h-4 w-4" />
                    <span>Review</span>
                </button>
            </div>
        </div>
    );

    const renderAnalysisCard = (item) => (
        <div key={item._id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                        <FileSearch className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Text Analysis</h3>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> {new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-2">
                            {item.originalText?.substring(0, 100)}...
                        </p>
                        <span className="text-2xl font-bold text-indigo-600">{item.overallScore}%</span>
                    </div>
                </div>
                <button 
                    onClick={() => openModal(item, 'analysis')}
                    className="btn-secondary flex items-center space-x-1"
                >
                    <Eye className="h-4 w-4" />
                    <span>Review</span>
                </button>
            </div>
        </div>
    );

    if (loading) return <div className="text-center py-10">Loading history...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">Learning History</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Review all your past activities and progress
                </p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <button
                    onClick={() => setActiveTab('content')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                        activeTab === 'content'
                            ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                    <FileText className="h-4 w-4" />
                    <span>Content ({contentHistory.length})</span>
                </button>
                <button
                    onClick={() => setActiveTab('tests')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                        activeTab === 'tests'
                            ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                    <TestTube className="h-4 w-4" />
                    <span>Tests ({testHistory.length})</span>
                </button>
                <button
                    onClick={() => setActiveTab('exercises')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                        activeTab === 'exercises'
                            ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                    <Dumbbell className="h-4 w-4" />
                    <span>Exercises ({exerciseHistory.length})</span>
                </button>
                <button
                    onClick={() => setActiveTab('analysis')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                        activeTab === 'analysis'
                            ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                    <FileSearch className="h-4 w-4" />
                    <span>Analysis ({analysisHistory.length})</span>
                </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {activeTab === 'content' && (
                    contentHistory.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 dark:text-gray-400">No content generated yet. Go create something!</div>
                    ) : (
                        contentHistory.map(renderContentCard)
                    )
                )}
                {activeTab === 'tests' && (
                    testHistory.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 dark:text-gray-400">No tests taken yet. Take your first test!</div>
                    ) : (
                        testHistory.map(renderTestCard)
                    )
                )}
                {activeTab === 'exercises' && (
                    exerciseHistory.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 dark:text-gray-400">No exercises completed yet. Try an exercise!</div>
                    ) : (
                        exerciseHistory.map(renderExerciseCard)
                    )
                )}
                {activeTab === 'analysis' && (
                    analysisHistory.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 dark:text-gray-400">No text analyses yet. Analyze your first text!</div>
                    ) : (
                        analysisHistory.map(renderAnalysisCard)
                    )
                )}
            </div>

            {/* Modal */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold">
                                    {selectedItem.type === 'content' && selectedItem.title}
                                    {selectedItem.type === 'test' && `${selectedItem.type} Test Results`}
                                    {selectedItem.type === 'exercise' && `${selectedItem.type} Exercise Results`}
                                    {selectedItem.type === 'analysis' && 'Text Analysis Results'}
                                </h2>
                                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                    ✕
                                </button>
                            </div>
                            
                            {selectedItem.type === 'content' && (
                                <div className="prose dark:prose-invert max-w-none">
                                    <div dangerouslySetInnerHTML={{ __html: selectedItem.body?.replace(/\n/g, '<br>') }} />
                                </div>
                            )}
                            
                            {selectedItem.type === 'test' && (
                                <div>
                                    <div className="text-center mb-6">
                                        <div className="text-4xl font-bold text-indigo-600 mb-2">{selectedItem.percentage}%</div>
                                        <p className="text-gray-600 dark:text-gray-400">{selectedItem.score} out of {selectedItem.totalQuestions} correct</p>
                                    </div>
                                    
                                    {selectedItem.questions && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold mb-4">Questions & Answers:</h3>
                                            {selectedItem.questions.map((q, index) => (
                                                <div key={index} className="border dark:border-gray-600 rounded-lg p-4">
                                                    <p className="font-medium mb-2">{q.question}</p>
                                                    {q.options && (
                                                        <div className="space-y-1 mb-2">
                                                            {q.options.map((option, optIndex) => (
                                                                <div key={optIndex} className={`text-sm p-2 rounded ${
                                                                    optIndex === q.correctAnswer ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                                                                    optIndex === q.userAnswer && optIndex !== q.correctAnswer ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' :
                                                                    'bg-gray-50 dark:bg-gray-700'
                                                                }`}>
                                                                    {optIndex === q.userAnswer && '👤 '}
                                                                    {optIndex === q.correctAnswer && '✅ '}
                                                                    {option}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {q.isCorrect ? '✅ Correct' : '❌ Incorrect'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {selectedItem.type === 'exercise' && (
                                <div>
                                    <div className="text-center mb-6">
                                        <div className="text-4xl font-bold text-indigo-600 mb-2">{Math.round((selectedItem.score / selectedItem.totalItems) * 100)}%</div>
                                        <p className="text-gray-600 dark:text-gray-400">{selectedItem.score} out of {selectedItem.totalItems} correct</p>
                                    </div>
                                </div>
                            )}
                            
                            {selectedItem.type === 'analysis' && (
                                <div>
                                    <div className="text-center mb-6">
                                        <div className="text-4xl font-bold text-indigo-600 mb-2">{selectedItem.overallScore}%</div>
                                        <p className="text-gray-600 dark:text-gray-400">Overall Score</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                        <h3 className="font-semibold mb-2">Original Text:</h3>
                                        <p className="text-gray-700 dark:text-gray-300">{selectedItem.originalText}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
