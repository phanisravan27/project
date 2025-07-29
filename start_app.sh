#!/bin/bash

# AI Life Narrator - Startup Script
echo "🌟 Starting AI Life Narrator Application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command_exists python3; then
    echo -e "${RED}Error: Python 3 is not installed${NC}"
    exit 1
fi

if ! command_exists node; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}Error: npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites check passed${NC}"

# Setup backend
echo -e "${BLUE}Setting up backend...${NC}"
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create database and seed demo data
echo "Setting up database and demo data..."
python seed_data.py

# Start backend server in background
echo -e "${GREEN}Starting backend server on http://localhost:8000${NC}"
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Setup frontend
echo -e "${BLUE}Setting up frontend...${NC}"
cd ../frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo -e "${GREEN}Starting frontend server on http://localhost:3000${NC}"
npm start &
FRONTEND_PID=$!

# Print instructions
echo ""
echo -e "${YELLOW}🎉 AI Life Narrator is starting up!${NC}"
echo ""
echo -e "${GREEN}Frontend:${NC} http://localhost:3000"
echo -e "${GREEN}Backend API:${NC} http://localhost:8000"
echo -e "${GREEN}API Docs:${NC} http://localhost:8000/docs"
echo ""
echo -e "${YELLOW}Demo Accounts:${NC}"
echo "1. Email: demo@example.com | Password: demo123"
echo "2. Email: jane@example.com | Password: password123"
echo ""
echo -e "${BLUE}Press Ctrl+C to stop both servers${NC}"

# Wait for user to stop
wait

# Cleanup
echo -e "${YELLOW}Shutting down servers...${NC}"
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
echo -e "${GREEN}✓ Servers stopped${NC}"