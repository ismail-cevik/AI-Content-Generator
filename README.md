# 🚀 AI Content Generator

An advanced, full-stack web application designed to revolutionize English language learning. By leveraging Artificial Intelligence, this platform generates personalized reading materials, stories, and exercises tailored to the user's interests and proficiency level (A1-C2).

## 🌟 Key Features

- Personalized profiles, gamification (points & streaks), and responsive UI.
- AI-powered dynamic content generation with difficulty adaptation.
- Interactive exercises, tests, and history tracking.

## 🆕 Recent Additions

- Placement Test: adaptive placement testing to determine user level.
- Pronunciation Practice: tools and UI for pronunciation exercises.
- Text Analysis: readability, vocabulary, and grammar analysis features.
- Expanded Exercises & Tests modules with scoring and history.
- Improved frontend contexts (`Auth`, `Theme`, `Language`) and routing.

These features were added to improve placement, speaking practice, and detailed text analytics.

## 🏗️ Technology Stack

### Backend (API)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose)
- **Auth**: JWT
- **AI Integration**: OpenAI

### Frontend (Client)
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **State**: React Context API

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/ismail-cevik/AI-Content-Generator.git
cd AI-Content-Generator
```

### 2. Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-content-generator
JWT_SECRET=your_super_secret_jwt_key
OPENAI_API_KEY=your_openai_api_key_here
```

Start backend:
```bash
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

App will usually be available at `http://localhost:5173`.

## 📖 Usage

1. Sign up and set your level & interests.
2. Use the Generate page to create AI content.
3. Try the Placement Test, Pronunciation, and Text Analysis pages for additional practice.

## 🤝 Contributing
1. Fork the repo
2. Create a branch (`git checkout -b feature/YourFeature`)
3. Commit & push
4. Open a pull request

## 📄 License
Distributed under the MIT License.
