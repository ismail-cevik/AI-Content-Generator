import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import GenerateContent from './pages/GenerateContent';
import History from './pages/History';
import Profile from './pages/Profile';
import Tests from './pages/Tests';
import Exercises from './pages/Exercises';
import TextAnalysis from './pages/TextAnalysis';
import Grammar from './pages/Grammar';
import PlacementTest from './pages/PlacementTest';
import Pronunciation from './pages/Pronunciation';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    
    if (!user) return <Navigate to="/login" />;
    
    return children;
};

const PlacementRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    
    if (!user) return <Navigate to="/login" />;
    if (user.placementTestCompleted) return <Navigate to="/dashboard" />;
    
    return children;
};

const MainAppRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    
    if (!user) return <Navigate to="/login" />;
    // Placement test kontrolünü kaldırıyoruz - sadece kayıt olurken yapılacak
    
    return children;
};

function App() {
    return (
        <Router>
            <LanguageProvider>
                <ThemeProvider>
                    <AuthProvider>
                    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
                        <Navbar />
                        <div className="flex-grow container mx-auto px-4 py-8">
                            <Routes>
                                <Route path="/" element={<LandingPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<RegisterPage />} />
                                <Route path="/placement-test" element={
                                    <PlacementRoute>
                                        <PlacementTest />
                                    </PlacementRoute>
                                } />

                                {/* Private Routes */}
                                <Route path="/dashboard" element={
                                    <MainAppRoute>
                                        <Dashboard />
                                    </MainAppRoute>
                                } />
                                <Route path="/generate" element={
                                    <MainAppRoute>
                                        <GenerateContent />
                                    </MainAppRoute>
                                } />
                                <Route path="/tests" element={
                                    <MainAppRoute>
                                        <Tests />
                                    </MainAppRoute>
                                } />
                                <Route path="/exercises" element={
                                    <MainAppRoute>
                                        <Exercises />
                                    </MainAppRoute>
                                } />
                                <Route path="/text-analysis" element={
                                    <MainAppRoute>
                                        <TextAnalysis />
                                    </MainAppRoute>
                                } />
                                <Route path="/grammar" element={
                                    <MainAppRoute>
                                        <Grammar />
                                    </MainAppRoute>
                                } />
                                <Route path="/history" element={
                                    <MainAppRoute>
                                        <History />
                                    </MainAppRoute>
                                } />
                                <Route path="/pronunciation" element={
                                    <MainAppRoute>
                                        <Pronunciation />
                                    </MainAppRoute>
                                } />
                                <Route path="/profile" element={
                                    <MainAppRoute>
                                        <Profile />
                                    </MainAppRoute>
                                } />
                            </Routes>
                        </div>
                    </div>
                    </AuthProvider>
                </ThemeProvider>
            </LanguageProvider>
        </Router>
    );
}

export default App;
