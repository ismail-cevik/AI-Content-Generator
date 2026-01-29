import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Flame, Star, Book, ArrowRight, TestTube, Dumbbell, FileSearch, BookMarked } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
    const { user } = useAuth();
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentActivity();
    }, []);

    const fetchRecentActivity = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            const [contentRes, testRes, exerciseRes] = await Promise.all([
                axios.get('/api/content/history', config),
                axios.get('/api/tests/history', config),
                axios.get('/api/exercises/history', config)
            ]);
            
            const allActivity = [
                ...(contentRes.data.success ? contentRes.data.data.slice(0, 3).map(item => ({ ...item, type: 'content' })) : []),
                ...(testRes.data.success ? testRes.data.data.slice(0, 2).map(item => ({ ...item, type: 'test' })) : []),
                ...(exerciseRes.data.success ? exerciseRes.data.data.slice(0, 2).map(item => ({ ...item, type: 'exercise' })) : [])
            ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
            
            setRecentActivity(allActivity);
        } catch (error) {
            console.error('Error fetching recent activity:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    {user.avatar?.type === 'emoji' ? (
                        <span className="text-2xl">{user.avatar.value}</span>
                    ) : user.avatar?.type === 'upload' ? (
                        <img src={user.avatar.value} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <span className="text-2xl">👤</span>
                    )}
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{user.name}</span>!</h1>
                    <p className="text-gray-600 dark:text-gray-400">Ready to continue your English learning journey?</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center space-x-3 mb-2">
                        <Star className="h-6 w-6 text-yellow-300" />
                        <span className="font-semibold opacity-90">Total Points</span>
                    </div>
                    <div className="text-4xl font-bold">{user.gamification?.points || 0}</div>
                </div>

                <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center space-x-3 mb-2">
                        <Flame className="h-6 w-6 text-yellow-200" />
                        <span className="font-semibold opacity-90">Daily Streak</span>
                    </div>
                    <div className="text-4xl font-bold">{user.gamification?.streak || 0} Days</div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700 flex flex-col justify-center items-start">
                    <h3 className="font-semibold text-gray-500 dark:text-gray-400 mb-1">Current Level</h3>
                    <div className="text-3xl font-bold text-gray-800 dark:text-white">{user.languageLevel}</div>
                    <Link to="/profile" className="text-indigo-600 dark:text-indigo-400 text-sm mt-2 hover:underline">Update Level</Link>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <div>
                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Quick Actions</h2>
                    <div className="space-y-4">
                        <Link to="/generate" className="card flex items-center justify-between group cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 border border-transparent">
                            <div className="flex items-center space-x-4">
                                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg group-hover:bg-indigo-600 transition-colors">
                                    <Book className="h-6 w-6 text-indigo-600 dark:text-indigo-400 group-hover:text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 dark:text-white">Generate Content</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Create stories and articles</p>
                                </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>

                        <Link to="/tests" className="card flex items-center justify-between group cursor-pointer hover:border-green-500 dark:hover:border-green-400 border border-transparent">
                            <div className="flex items-center space-x-4">
                                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg group-hover:bg-green-600 transition-colors">
                                    <TestTube className="h-6 w-6 text-green-600 dark:text-green-400 group-hover:text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 dark:text-white">Take a Test</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Practice with quizzes</p>
                                </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>

                        <Link to="/exercises" className="card flex items-center justify-between group cursor-pointer hover:border-orange-500 dark:hover:border-orange-400 border border-transparent">
                            <div className="flex items-center space-x-4">
                                <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg group-hover:bg-orange-600 transition-colors">
                                    <Dumbbell className="h-6 w-6 text-orange-600 dark:text-orange-400 group-hover:text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 dark:text-white">Practice Exercises</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Drag & drop activities</p>
                                </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>

                        <Link to="/text-analysis" className="card flex items-center justify-between group cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 border border-transparent">
                            <div className="flex items-center space-x-4">
                                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg group-hover:bg-purple-600 transition-colors">
                                    <FileSearch className="h-6 w-6 text-purple-600 dark:text-purple-400 group-hover:text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 dark:text-white">Analyze Text</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Check your writing</p>
                                </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>

                        <Link to="/grammar" className="card flex items-center justify-between group cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 border border-transparent">
                            <div className="flex items-center space-x-4">
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg group-hover:bg-blue-600 transition-colors">
                                    <BookMarked className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 dark:text-white">Grammar Guide</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Learn grammar rules</p>
                                </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recent Activity</h2>
                        <Link to="/history" className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline">View All</Link>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                        {loading ? (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading...</div>
                        ) : recentActivity.length > 0 ? (
                            <div className="space-y-4">
                                {recentActivity.map((item, index) => (
                                    <div key={`${item.type}-${item._id}`} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className={`p-2 rounded-lg ${
                                            item.type === 'content' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                                            item.type === 'test' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                                            'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                                        }`}>
                                            {item.type === 'content' && <Book className="h-4 w-4" />}
                                            {item.type === 'test' && <TestTube className="h-4 w-4" />}
                                            {item.type === 'exercise' && <Dumbbell className="h-4 w-4" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800 dark:text-white">
                                                {item.type === 'content' && item.title}
                                                {item.type === 'test' && `${item.type} Test - ${item.percentage}%`}
                                                {item.type === 'exercise' && `${item.type} Exercise - ${Math.round((item.score / item.totalItems) * 100)}%`}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <Book className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No recent activity</p>
                                <p className="text-sm">Start learning to see your progress here!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
