# AI Life Narrator - Setup Guide

Welcome to the AI Life Narrator setup guide! This document will help you get the application running on your local machine.

## 🚀 Quick Start

For the fastest setup, use our one-command script:

```bash
./start_app.sh
```

This script will automatically:
- Check prerequisites
- Set up the backend with Python virtual environment
- Install all dependencies
- Create the database with demo data
- Start both backend and frontend servers

## 📋 Manual Setup

If you prefer to set up manually or the script doesn't work for your system:

### Prerequisites

- **Python 3.9+** - [Download here](https://python.org/downloads/)
- **Node.js 16+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a Python virtual environment:
```bash
# On macOS/Linux
python3 -m venv venv
source venv/bin/activate

# On Windows
python -m venv venv
venv\Scripts\activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your settings (optional for demo)
# Add your OpenAI API key if you want full AI functionality
```

5. Create database and seed demo data:
```bash
python seed_data.py
```

6. Start the backend server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install npm dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env
```

4. Start the frontend development server:
```bash
npm start
```

## 🔗 Access the Application

Once both servers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 👤 Demo Accounts

The application comes with pre-created demo accounts:

### Account 1 (Main Demo)
- **Email**: demo@example.com
- **Password**: demo123
- **Features**: 6 sample entries with AI-generated stories

### Account 2 (Secondary Demo)
- **Email**: jane@example.com
- **Password**: password123
- **Features**: 2 sample entries

## 🔧 Configuration

### OpenAI API Integration

To enable full AI functionality (story generation, image creation):

1. Get an OpenAI API key from [platform.openai.com](https://platform.openai.com/)
2. Add it to your `backend/.env` file:
```env
OPENAI_API_KEY=your_actual_api_key_here
```
3. Restart the backend server

**Note**: The app works without an API key, but AI story generation will return placeholder text.

### Database

The application uses SQLite by default, which requires no additional setup. The database file (`life_narrator.db`) will be created automatically in the backend directory.

## 🧪 Testing the Features

### Core Features to Test:

1. **Authentication**
   - Register a new account
   - Login/logout functionality
   - Session persistence

2. **Entry Creation**
   - Text-based diary entries
   - Audio recording (requires microphone permission)
   - File uploads (images, audio files)

3. **AI Story Generation**
   - Create an entry and generate an AI story
   - Try different story styles (journal, comic, poetic)

4. **Timeline View**
   - Browse all your entries chronologically
   - View AI-generated stories and original content

5. **UI/UX**
   - Dynamic night world theme
   - Responsive design on different screen sizes
   - Smooth animations and transitions

## 🔍 Troubleshooting

### Common Issues:

**Backend won't start:**
- Check Python version: `python3 --version`
- Ensure virtual environment is activated
- Install dependencies: `pip install -r requirements.txt`

**Frontend won't start:**
- Check Node.js version: `node --version`
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

**Database errors:**
- Delete the database file: `rm backend/life_narrator.db`
- Re-run the seed script: `python backend/seed_data.py`

**CORS errors:**
- Ensure backend is running on port 8000
- Check frontend .env file has correct API URL

**Audio recording not working:**
- Grant microphone permissions in your browser
- Use HTTPS or localhost (required for microphone access)
- Check browser compatibility (Chrome/Firefox recommended)

### Getting Help:

If you encounter issues:
1. Check the browser console for error messages
2. Check the backend logs in the terminal
3. Ensure all prerequisites are installed
4. Try the manual setup if the script fails

## 🏗️ Architecture Overview

```
AI Life Narrator/
├── backend/                 # FastAPI Python backend
│   ├── main.py             # Main application entry
│   ├── database.py         # Database models and setup
│   ├── auth.py             # Authentication logic
│   ├── ai_services.py      # OpenAI API integration
│   └── seed_data.py        # Demo data creation
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   ├── context/        # React context for state
│   │   ├── services/       # API service layer
│   │   └── styles/         # Global styles and themes
│   └── public/             # Static assets
└── start_app.sh           # One-command startup script
```

## 🚀 Production Deployment

For production deployment:

1. Set strong secret keys in environment variables
2. Use a production database (PostgreSQL recommended)
3. Set up proper CORS origins
4. Use environment-specific configurations
5. Set up SSL/HTTPS
6. Configure proper logging and monitoring

Happy coding! ✨