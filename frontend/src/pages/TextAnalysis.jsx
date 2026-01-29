import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';
import { CheckCircle, XCircle, FileText, Send, Loader2, Upload, X } from 'lucide-react';

const TextAnalysis = () => {
    const [text, setText] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysisHistory, setAnalysisHistory] = useState([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);
    const { user } = useAuth();
    const { t } = useLanguage();

    useEffect(() => {
        fetchAnalysisHistory();
    }, []);

    const fetchAnalysisHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:5001/api/text-analysis/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnalysisHistory(data.data);
        } catch (error) {
            console.error('Error fetching analysis history:', error);
        }
    };

    const analyzeText = async () => {
        if (!text.trim()) {
            alert('Lütfen analiz edilecek metin girin.');
            return;
        }
        
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('http://localhost:5001/api/text-analysis/analyze', 
                { text },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setAnalysis(data.data);
            fetchAnalysisHistory();
        } catch (error) {
            console.error('Error analyzing text:', error);
            alert('Metin analiz edilirken hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    const loadPreviousAnalysis = (analysisData) => {
        setText(analysisData.originalText);
        setAnalysis(analysisData);
    };

    const clearAnalysis = () => {
        setText('');
        setAnalysis(null);
    };

    // Drag and Drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        handleFiles(files);
    };

    const handleFiles = (files) => {
        const textFile = files.find(file => file.type === 'text/plain' || file.name.endsWith('.txt'));
        
        if (!textFile) {
            alert('Lütfen sadece .txt dosyaları yükleyin.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            setText(content);
        };
        reader.readAsText(textFile);
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{t('textAnalysis')}</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    {t('submitTextForAnalysis')}
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Input Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('submitYourText')}</h2>
                        
                        {/* File Upload Area */}
                        <div 
                            className={`mb-4 p-4 border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer ${
                                isDragOver 
                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                                    : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
                            }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={triggerFileSelect}
                        >
                            <div className="text-center">
                                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <span className="font-medium text-indigo-600 dark:text-indigo-400">
                                        {t('clickToSelectFile')}
                                    </span>
                                    {' '}{t('orDragAndDrop')}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {t('onlyTxtSupported')}
                                </p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".txt,text/plain"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Analiz için İngilizce metninizi buraya girin..."
                                    className="w-full h-48 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                />
                                {text && (
                                    <button
                                        onClick={() => setText('')}
                                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {text.length} karakter
                                </span>
                                <div className="space-x-3">
                                    <button 
                                        onClick={clearAnalysis}
                                        className="btn-secondary"
                                        disabled={!text && !analysis}
                                    >
                                        Temizle
                                    </button>
                                    <button 
                                        onClick={analyzeText}
                                        disabled={!text.trim() || loading}
                                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span>Analiz Ediliyor...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4" />
                                                <span>Metni Analiz Et</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analysis Results */}
                    {analysis && (
                        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Analiz Sonuçları</h2>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-indigo-600">
                                        {analysis.overallScore}%
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Genel Puan
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {analysis.analysis.map((item, index) => (
                                    <div key={index} className="border-l-4 pl-4 py-2" 
                                         style={{ borderColor: item.isCorrect ? '#10B981' : '#EF4444' }}>
                                        <div className="flex items-start space-x-3">
                                            {item.isCorrect ? (
                                                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                                            )}
                                            <div className="flex-1">
                                                <p className="font-medium mb-2 text-gray-900 dark:text-white">
                                                    "{item.sentence}"
                                                </p>
                                                {item.corrections.length > 0 && (
                                                    <div className="space-y-2">
                                                        {item.corrections.map((correction, corrIndex) => (
                                                            <div key={corrIndex} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                                                <p className="text-sm">
                                                                    <span className="text-red-600 dark:text-red-400 line-through">
                                                                        {correction.original}
                                                                    </span>
                                                                    {' → '}
                                                                    <span className="text-green-600 dark:text-green-400 font-medium">
                                                                        {correction.corrected}
                                                                    </span>
                                                                </p>
                                                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                                    {correction.explanation}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {item.isCorrect && (
                                                    <p className="text-sm text-green-600 dark:text-green-400">
                                                        ✓ Bu cümle dilbilgisi açısından doğru
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* History Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Analiz Geçmişi</h2>
                        {analysisHistory.length > 0 ? (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {analysisHistory.map((item) => (
                                    <div 
                                        key={item._id} 
                                        className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                        onClick={() => loadPreviousAnalysis(item)}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                            <span className="text-sm font-bold text-indigo-600">
                                                {item.overallScore}%
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                            {item.originalText.substring(0, 60)}...
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {new Date(item.createdAt).toLocaleDateString('tr-TR')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">Henüz analiz yok</p>
                        )}
                    </div>

                    {/* Tips */}
                    <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-indigo-700 dark:text-indigo-300 mb-3">
                            Daha İyi Analiz İçin İpuçları
                        </h3>
                        <ul className="text-sm text-indigo-600 dark:text-indigo-400 space-y-2">
                            <li>• Tam cümleler yazın</li>
                            <li>• Doğru noktalama kullanın</li>
                            <li>• Önce yazımınızı kontrol edin</li>
                            <li>• Farklı cümle yapıları kullanın</li>
                            <li>• .txt dosyalarını sürükleyip bırakabilirsiniz</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextAnalysis;