#!/bin/bash

# Medical GuidedPath AI Backend Setup Script
echo "🚀 Setting up Medical GuidedPath AI Backend..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️ Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📥 Installing Python dependencies..."
pip install -r requirements.txt

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p medical_chroma_db
mkdir -p logs

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-1106-preview

# Anthropic Configuration (Optional)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Vector Database
CHROMA_DB_PATH=./medical_chroma_db

# Medical Settings
MEDICAL_INSTITUTIONS=ASCO,NCCN,ESMO,EULAR,FDA,NIH
EVIDENCE_LEVELS=meta_analysis,systematic_review,rct,cohort_study

# Server Configuration
API_HOST=0.0.0.0
API_PORT=8000
LOG_LEVEL=INFO
EOF
    echo "⚠️ Please edit the .env file with your actual API keys!"
fi

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit the .env file with your API keys"
echo "2. Run: source venv/bin/activate"
echo "3. Run: python main.py --host 0.0.0.0 --port 8000"
echo ""
echo "🔗 The backend will be available at: http://localhost:8000"
echo "📚 API documentation: http://localhost:8000/docs"
echo ""
echo "💡 Don't forget to also set up the frontend:"
echo "   cd .. && npm install && npm run dev"
