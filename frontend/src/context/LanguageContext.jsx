import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
    en: {
        // Navigation
        dashboard: 'Dashboard',
        generate: 'Generate',
        tests: 'Tests',
        exercises: 'Exercises',
        analysis: 'Analysis',
        grammar: 'Grammar',
        pronunciation: 'Pronunciation',
        history: 'History',
        profile: 'Profile',
        logout: 'Logout',
        
        // Common
        loading: 'Loading...',
        save: 'Save',
        cancel: 'Cancel',
        submit: 'Submit',
        continue: 'Continue',
        clear: 'Clear',
        start: 'Start',
        finish: 'Finish',
        correct: 'Correct',
        incorrect: 'Incorrect',
        score: 'Score',
        
        // Auth
        login: 'Login',
        register: 'Sign Up',
        welcomeBack: 'Welcome Back',
        createAccount: 'Create Account',
        emailAddress: 'Email Address',
        password: 'Password',
        fullName: 'Full Name',
        alreadyHaveAccount: 'Already have an account?',
        dontHaveAccount: "Don't have an account?",
        
        // Tests
        englishTests: 'English Tests',
        testYourKnowledge: 'Test your English knowledge with interactive quizzes',
        startNewTest: 'Start New Test',
        practiceTest: 'Practice Test',
        testHistory: 'Test History',
        testResults: 'Test Results',
        outOfCorrect: 'out of',
        takeAnotherTest: 'Take Another Test',
        generatingTest: 'Generating Test...',
        nextQuestion: 'Moving to next question...',
        noTestsTaken: 'No tests taken yet',
        
        // Exercises
        interactiveExercises: 'Interactive Exercises',
        practiceWithDragDrop: 'Practice English with drag & drop fill-in-the-blank exercises',
        startNewExercise: 'Start New Exercise',
        chooseDifficulty: 'Choose your difficulty level and start practicing',
        beginner: 'Beginner',
        elementary: 'Elementary',
        intermediate: 'Intermediate',
        upperIntermediate: 'Upper-Intermediate',
        myLevel: 'My Level',
        exerciseHistory: 'Exercise History',
        noExercisesCompleted: 'No exercises completed yet',
        dragDropExercise: 'Drag & Drop Exercise',
        dragWordsToFill: 'Drag the words below to fill in the blanks',
        availableWords: 'Available Words',
        submitExercise: 'Submit Exercise',
        exerciseResults: 'Exercise Results',
        review: 'Review',
        tryAnotherExercise: 'Try Another Exercise',
        clickToFill: 'Click to Fill',
        
        // Text Analysis
        textAnalysis: 'Text Analysis',
        submitTextForAnalysis: 'Submit your English text for grammar and style analysis',
        submitYourText: 'Submit Your Text',
        enterTextForAnalysis: 'Enter your English text here for analysis...',
        characters: 'characters',
        analyzeText: 'Analyze Text',
        analyzing: 'Analyzing...',
        analysisResults: 'Analysis Results',
        overallScore: 'Overall Score',
        analysisHistory: 'Analysis History',
        noAnalysesYet: 'No analyses yet',
        tipsForBetterAnalysis: 'Tips for Better Analysis',
        writeCompleteSentences: 'Write complete sentences',
        useProperPunctuation: 'Use proper punctuation',
        checkSpellingFirst: 'Check your spelling first',
        includeVariedStructures: 'Include varied sentence structures',
        dragAndDropFiles: 'Drag and drop .txt files',
        clickToSelectFile: 'Click to select file',
        orDragAndDrop: 'or drag and drop',
        onlyTxtSupported: 'Only .txt files supported',
        sentenceGrammaticallyCorrect: 'This sentence is grammatically correct',
        
        // Pronunciation
        pronunciationPractice: 'Pronunciation Practice',
        improveYourPronunciation: 'Improve your English pronunciation',
        pronunciationFeaturesComingSoon: 'Pronunciation features coming soon...',
        
        // Profile
        interests: 'Interests',
        languageLevel: 'Language Level',
        siteLanguage: 'Site Language',
        english: 'English',
        turkish: 'Turkish'
    },
    tr: {
        // Navigation
        dashboard: 'Ana Sayfa',
        generate: 'Oluştur',
        tests: 'Testler',
        exercises: 'Egzersizler',
        analysis: 'Analiz',
        grammar: 'Gramer',
        pronunciation: 'Telaffuz',
        history: 'Geçmiş',
        profile: 'Profil',
        logout: 'Çıkış',
        
        // Common
        loading: 'Yükleniyor...',
        save: 'Kaydet',
        cancel: 'İptal',
        submit: 'Gönder',
        continue: 'Devam Et',
        clear: 'Temizle',
        start: 'Başlat',
        finish: 'Bitir',
        correct: 'Doğru',
        incorrect: 'Yanlış',
        score: 'Puan',
        
        // Auth
        login: 'Giriş Yap',
        register: 'Kayıt Ol',
        welcomeBack: 'Tekrar Hoş Geldiniz',
        createAccount: 'Hesap Oluştur',
        emailAddress: 'E-posta Adresi',
        password: 'Şifre',
        fullName: 'Ad Soyad',
        alreadyHaveAccount: 'Zaten hesabınız var mı?',
        dontHaveAccount: 'Hesabınız yok mu?',
        
        // Tests
        englishTests: 'İngilizce Testleri',
        testYourKnowledge: 'İngilizce bilginizi interaktif testlerle ölçün',
        startNewTest: 'Yeni Test Başlat',
        practiceTest: 'Pratik Test',
        testHistory: 'Test Geçmişi',
        testResults: 'Test Sonuçları',
        outOfCorrect: '/',
        takeAnotherTest: 'Yeni Test Çöz',
        generatingTest: 'Test Hazırlanıyor...',
        nextQuestion: 'Sonraki soruya geçiliyor...',
        noTestsTaken: 'Henüz test çözmediniz',
        
        // Exercises
        interactiveExercises: 'İnteraktif Egzersizler',
        practiceWithDragDrop: 'Sürükle-bırak boşluk doldurma egzersizleri ile İngilizce pratik yapın',
        startNewExercise: 'Yeni Egzersiz Başlat',
        chooseDifficulty: 'Zorluk seviyenizi seçin ve pratik yapmaya başlayın',
        beginner: 'Başlangıç',
        elementary: 'Temel',
        intermediate: 'Orta',
        upperIntermediate: 'Üst-Orta',
        myLevel: 'Seviyem',
        exerciseHistory: 'Egzersiz Geçmişi',
        noExercisesCompleted: 'Henüz egzersiz tamamlanmadı',
        dragDropExercise: 'Sürükle Bırak Egzersizi',
        dragWordsToFill: 'Boşlukları doldurmak için aşağıdaki kelimeleri sürükleyin',
        availableWords: 'Kullanılabilir Kelimeler',
        submitExercise: 'Egzersizi Gönder',
        exerciseResults: 'Egzersiz Sonuçları',
        review: 'İnceleme',
        tryAnotherExercise: 'Başka Egzersiz Dene',
        clickToFill: 'Doldurmak İçin Tıkla',
        
        // Text Analysis
        textAnalysis: 'Metin Analizi',
        submitTextForAnalysis: 'İngilizce metninizi dilbilgisi ve stil analizi için gönderin',
        submitYourText: 'Metninizi Gönderin',
        enterTextForAnalysis: 'Analiz için İngilizce metninizi buraya girin...',
        characters: 'karakter',
        analyzeText: 'Metni Analiz Et',
        analyzing: 'Analiz Ediliyor...',
        analysisResults: 'Analiz Sonuçları',
        overallScore: 'Genel Puan',
        analysisHistory: 'Analiz Geçmişi',
        noAnalysesYet: 'Henüz analiz yok',
        tipsForBetterAnalysis: 'Daha İyi Analiz İçin İpuçları',
        writeCompleteSentences: 'Tam cümleler yazın',
        useProperPunctuation: 'Doğru noktalama kullanın',
        checkSpellingFirst: 'Önce yazımınızı kontrol edin',
        includeVariedStructures: 'Farklı cümle yapıları kullanın',
        dragAndDropFiles: '.txt dosyalarını sürükleyip bırakabilirsiniz',
        clickToSelectFile: 'Dosya seçmek için tıklayın',
        orDragAndDrop: 'veya sürükleyip bırakın',
        onlyTxtSupported: 'Sadece .txt dosyaları desteklenir',
        sentenceGrammaticallyCorrect: 'Bu cümle dilbilgisi açısından doğru',
        
        // Pronunciation
        pronunciationPractice: 'Telaffuz Pratikleri',
        improveYourPronunciation: 'İngilizce telaffuzunuzu geliştirin',
        pronunciationFeaturesComingSoon: 'Telaffuz özellikleri yakında eklenecek...',
        
        // Profile
        interests: 'İlgi Alanları',
        languageLevel: 'Dil Seviyesi',
        siteLanguage: 'Site Dili',
        english: 'İngilizce',
        turkish: 'Türkçe'
    }
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || 'en';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const t = (key) => {
        return translations[language][key] || key;
    };

    const changeLanguage = (lang) => {
        setLanguage(lang);
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);