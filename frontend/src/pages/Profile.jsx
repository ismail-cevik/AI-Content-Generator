import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';
import { Save, Upload, User } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const { language, changeLanguage, t } = useLanguage();

    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        interests: user.interests ? user.interests.join(', ') : '',
        languageLevel: user.languageLevel
    });
    const [avatar, setAvatar] = useState({
        type: user.avatar?.type || 'emoji',
        value: user.avatar?.value || '👤'
    });
    const [message, setMessage] = useState('');

    const emojiAvatars = [
        '👤', '👦', '👧', '👨', '👩', '👴', '👵', '👶',
        '👱', '👱‍♀️', '👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓', '👨‍🚀', '👩‍🚀',
        '🤓', '😎', '🤩', '😊', '😄', '😁', '😍', '🥰'
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvatarSelect = (emoji) => {
        setAvatar({ type: 'emoji', value: emoji });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setMessage('File size must be less than 2MB');
                return;
            }
            
            // Check file type
            if (!file.type.startsWith('image/')) {
                setMessage('Please select an image file');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatar({ type: 'upload', value: e.target.result });
            };
            reader.onerror = () => {
                setMessage('Error reading file');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const payload = {
                ...formData,
                interests: formData.interests.split(',').map(i => i.trim()).filter(i => i),
                avatar
            };

            const { data } = await axios.put('/api/auth/updatedetails', payload, config);
            if (data.success) {
                setMessage('Profile updated successfully!');
            }
        } catch (error) {
            setMessage('Failed to update profile');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">My Profile</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage your account settings and preferences
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Avatar Section */}
                <div className="md:col-span-1">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold mb-4">Profile Avatar</h2>
                        
                        {/* Current Avatar Display */}
                        <div className="text-center mb-6">
                            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                {avatar.type === 'emoji' ? (
                                    <span className="text-4xl">{avatar.value}</span>
                                ) : (
                                    <img src={avatar.value} alt="Avatar" className="w-full h-full object-cover" />
                                )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Current Avatar</p>
                        </div>

                        {/* Avatar Type Selection */}
                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="avatarType"
                                        checked={avatar.type === 'emoji'}
                                        onChange={() => setAvatar({ type: 'emoji', value: '👤' })}
                                        className="text-indigo-600"
                                    />
                                    <span>Emoji Avatar</span>
                                </label>
                            </div>
                            <div>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="avatarType"
                                        checked={avatar.type === 'upload'}
                                        onChange={() => setAvatar({ type: 'upload', value: '' })}
                                        className="text-indigo-600"
                                    />
                                    <span>Upload Image</span>
                                </label>
                            </div>
                        </div>

                        {/* Emoji Selection */}
                        {avatar.type === 'emoji' && (
                            <div className="mt-4">
                                <p className="text-sm font-medium mb-3">Choose an emoji:</p>
                                <div className="grid grid-cols-6 gap-2">
                                    {emojiAvatars.map((emoji, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleAvatarSelect(emoji)}
                                            className={`w-10 h-10 text-xl rounded-lg border-2 transition-colors ${
                                                avatar.value === emoji
                                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                                                    : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500'
                                            }`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* File Upload */}
                        {avatar.type === 'upload' && (
                            <div className="mt-4">
                                <label className="block">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
                                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload image</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Max 2MB, JPG/PNG</p>
                                    </div>
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Form */}
                <div className="md:col-span-2">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold mb-6">Profile Information</h2>
                        
                        {message && (
                            <div className={`p-4 rounded-lg mb-6 ${
                                message.includes('success') 
                                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                            }`}>
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                                    readOnly
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Interests (comma separated)</label>
                                <input
                                    type="text"
                                    name="interests"
                                    value={formData.interests}
                                    onChange={handleChange}
                                    placeholder="Sports, Music, Science..."
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">These topics help customize your content.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('siteLanguage')}</label>
                                <select
                                    value={language}
                                    onChange={(e) => changeLanguage(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white"
                                >
                                    <option value="en">{t('english')}</option>
                                    <option value="tr">{t('turkish')}</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('languageLevel')}</label>
                                <select
                                    name="languageLevel"
                                    value={formData.languageLevel}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white"
                                >
                                    <option>A1</option>
                                    <option>A2</option>
                                    <option>B1</option>
                                    <option>B2</option>
                                    <option>C1</option>
                                    <option>C2</option>
                                    <option>Not Selected</option>
                                </select>
                            </div>

                            <button type="submit" className="btn-primary w-full flex justify-center items-center space-x-2">
                                <Save className="h-5 w-5" />
                                <span>Save Changes</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
