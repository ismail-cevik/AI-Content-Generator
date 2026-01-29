@echo off
echo ========================================
echo    AI Content Generator Başlatılıyor
echo ========================================

echo.
echo Backend başlatılıyor...
cd backend
start "Backend Server" cmd /k "npm run dev"

echo.
echo Frontend başlatılıyor...
cd ../frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo Sunucular başlatıldı!
echo Backend: http://localhost:5001
echo Frontend: http://localhost:5173
echo ========================================

echo.
echo Tarayıcınızda http://localhost:5173 adresini açın
pause