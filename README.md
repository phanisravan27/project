# 🌟 AI Life Narrator - Full-Stack App

A beautiful, full-stack AI-powered "Life Narrator" web application that helps users capture their daily experiences through voice, text, and images, then generates creative stories using AI. Experience your life story like never before with our dynamic night world theme and intelligent storytelling.

![Dynamic Night Theme](https://img.shields.io/badge/Theme-Dynamic%20Night%20World-blueviolet)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%2B%20FastAPI-blue)
![AI Powered](https://img.shields.io/badge/AI-OpenAI%20GPT--4-green)

## ✨ Key Features

### 🎨 Dynamic Night World UI
- Animated starfield background with moving celestial elements
- Glass morphism design with blur effects
- Responsive design that works beautifully on all devices
- Smooth animations and transitions powered by Framer Motion

### 🔐 Complete Authentication System
- Secure JWT-based authentication
- User registration and login
- **Full logout functionality** with session cleanup
- Protected routes and automatic token validation

### 📝 Rich Content Creation
- **Text Diary Entries** - Write your thoughts and experiences
- **Voice Recording** - Capture moments with your voice using Web Audio API
- **File Uploads** - Add photos and audio files to your entries
- **Multiple Story Styles** - Choose between journal, comic, or poetic narratives

### 🤖 AI-Powered Story Generation
- **OpenAI GPT-4 Integration** - Transform raw entries into beautiful stories
- **DALL-E Image Generation** - Create custom illustrations for your stories
- **Voice-to-Text** - Automatic transcription using OpenAI Whisper
- **Multiple AI Styles** - Journal, comic, and poetic story generation

### 📅 Beautiful Timeline & Organization
- Chronological timeline view of all your entries
- Calendar-style navigation through your life story
- Search and filter functionality
- Rich metadata display (audio, images, generated content)

### 📊 Intelligent Recaps
- Weekly and monthly story summaries
- AI-generated insights and highlights
- Progress tracking and statistics
- Exportable content for sharing

## 🚀 Quick Start

**One-Command Setup:**
```bash
./start_app.sh
```

This script automatically:
- Checks all prerequisites
- Sets up Python virtual environment
- Installs all dependencies
- Creates database with demo data
- Starts both servers

## 🛠️ Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React 18 + Hooks | Dynamic UI with modern React patterns |
| **Styling** | Styled Components + Framer Motion | Dynamic theming and smooth animations |
| **Backend** | Python FastAPI | High-performance async API |
| **Database** | SQLite (dev) / PostgreSQL (prod) | Data persistence with SQLAlchemy ORM |
| **AI Services** | OpenAI GPT-4, Whisper, DALL-E | Story generation, transcription, images |
| **Authentication** | JWT + bcrypt | Secure token-based authentication |
| **File Storage** | Local filesystem (configurable) | Audio/image upload handling |

## 📱 Application Screenshots

### Night World Theme
The entire application features a dynamic night sky background with:
- ✨ Animated starfield with moving stars
- 🌙 Glowing moon with subtle animation
- 🌌 Gradient backgrounds that shift throughout the experience
- 💎 Glass morphism cards with blur effects

### Core Pages
- **Dashboard** - Welcome screen with quick actions and recent entries
- **Timeline** - Chronological view of your life story
- **Create Entry** - Multi-tab interface for text, audio, and files
- **Authentication** - Beautiful login/register forms

## 🎯 Demo Accounts

The application comes with pre-seeded demo data:

### Main Demo Account
- **Email**: demo@example.com  
- **Password**: demo123
- **Content**: 6 sample entries with AI-generated stories in different styles

### Secondary Demo Account  
- **Email**: jane@example.com
- **Password**: password123
- **Content**: 2 sample entries showcasing different features

## 🔧 Detailed Setup

See **[SETUP.md](SETUP.md)** for comprehensive setup instructions including:
- Prerequisites and installation
- Manual setup steps
- Environment configuration
- OpenAI API integration
- Troubleshooting guide

## 📖 API Documentation

Once running, visit **http://localhost:8000/docs** for interactive API documentation.

### Key Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | User registration |
| `POST` | `/auth/login` | User login |
| `POST` | `/auth/logout` | **User logout with token cleanup** |
| `POST` | `/upload/audio` | Upload & transcribe audio |
| `POST` | `/upload/image` | Upload images |
| `POST` | `/entries` | Create diary entries |
| `GET` | `/timeline` | Get timeline data |
| `POST` | `/generate/story` | Generate AI stories |
| `POST` | `/generate/recap` | Create weekly/monthly recaps |

## 🎨 Design Philosophy

### Night World Diary Theme
The application embodies a "digital diary under the stars" concept:
- **Dark, cosmic backgrounds** create a contemplative mood
- **Soft, animated elements** provide subtle visual interest
- **Glass morphism effects** add depth and modernity
- **Warm accent colors** (purple gradients) provide visual hierarchy

### User Experience
- **Intuitive navigation** with clear visual feedback
- **Responsive design** that works on desktop, tablet, and mobile
- **Smooth animations** enhance the feeling of interacting with memories
- **Accessible design** with proper contrast and keyboard navigation

## 🔮 Advanced Features

### AI Story Generation Styles
1. **Journal Style** - Personal, reflective entries
2. **Comic Style** - Fun, narrative-driven stories with humor
3. **Poetic Style** - Lyrical, artistic expressions

### File Upload System
- **Multi-format support** - Images (JPG, PNG, GIF), Audio (WAV, MP3, M4A)
- **Automatic file processing** - Transcription for audio, metadata extraction
- **Secure storage** - Files linked to user accounts with proper permissions

### Real-time Features
- **Live audio recording** with visual feedback
- **Progressive loading** for better perceived performance
- **Toast notifications** for user feedback
- **Auto-save functionality** (planned feature)

## 🌍 Production Deployment

Ready for production with:
- Environment-specific configurations
- Security best practices implemented
- Database migration support
- CORS and security headers configured
- Comprehensive error handling

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the AI models that power the storytelling
- **React Community** for the excellent ecosystem of tools and libraries
- **FastAPI Team** for creating such an elegant Python web framework
- **Design Inspiration** from modern note-taking apps and digital journals

---

**Start your AI-powered life story today!** ✨

```bash
./start_app.sh
```