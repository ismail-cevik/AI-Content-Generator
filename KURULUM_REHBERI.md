# AI Content Generator - Kurulum Rehberi

## ✅ Tamamlanan Adımlar
1. ✅ Proje GitHub'dan klonlandı
2. ✅ Backend bağımlılıkları yüklendi (npm install)
3. ✅ Frontend bağımlılıkları yüklendi (npm install)
4. ✅ Backend .env dosyası oluşturuldu

## 🔧 Çalıştırmadan Önce Yapılması Gerekenler

### 1. MongoDB Kurulumu
- MongoDB'yi bilgisayarınıza kurun: https://www.mongodb.com/try/download/community
- Veya MongoDB Atlas (bulut) kullanın: https://www.mongodb.com/atlas

### 2. OpenAI API Key Alın
- https://platform.openai.com/ adresine gidin
- API key oluşturun
- `.env` dosyasındaki `OPENAI_API_KEY` değerini güncelleyin

### 3. .env Dosyasını Düzenleyin
Backend klasöründeki `.env` dosyasını açın ve şu değerleri güncelleyin:
```
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
JWT_SECRET=your-unique-secret-key-here
```

## 🚀 Projeyi Çalıştırma

### Backend'i Başlatın (Terminal 1):
```bash
cd backend
npm run dev
```
Backend http://localhost:5000 adresinde çalışacak

### Frontend'i Başlatın (Terminal 2):
```bash
cd frontend  
npm run dev
```
Frontend http://localhost:5173 adresinde çalışacak

## 📝 Notlar
- MongoDB'nin çalıştığından emin olun
- İki terminal penceresi açmanız gerekiyor (backend ve frontend için)
- OpenAI API key'i olmadan AI özellikler çalışmayacak

## 🎯 Kullanım
1. http://localhost:5173 adresine gidin
2. Hesap oluşturun
3. İngilizce seviyenizi seçin
4. AI ile içerik üretmeye başlayın!