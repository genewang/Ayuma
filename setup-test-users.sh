#!/bin/bash

# Test Users Setup Script for GuidedPath Development
# Run this script to create test users in your Supabase database

echo "🧪 Setting up test users for GuidedPath development..."
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "npm install -g supabase"
    echo ""
    echo "Or create users manually in your Supabase Dashboard:"
    echo "1. Go to Authentication > Users"
    echo "2. Click 'Add User'"
    echo "3. Create the following test accounts:"
    echo ""
    echo "📧 Test Users:"
    echo "   frontend.dev@example.com    | Frontend123!"
    echo "   advisor@example.com         | Advisor123!"
    echo "   student@example.com         | Student123!"
    echo ""
    echo "4. The profiles will be created automatically via database triggers"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if we're in a Supabase project
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Not in a Supabase project directory"
    echo "Please run this script from your Supabase project root"
    echo ""
    echo "Alternative: Create users manually in Supabase Dashboard"
    exit 1
fi

echo "📧 Creating test users..."

# Create test users
echo "Creating frontend.dev@example.com..."
supabase auth signup --email frontend.dev@example.com --password Frontend123! || echo "User may already exist"

echo "Creating advisor@example.com..."
supabase auth signup --email advisor@example.com --password Advisor123! || echo "User may already exist"

echo "Creating student@example.com..."
supabase auth signup --email student@example.com --password Student123! || echo "User may already exist"

echo ""
echo "✅ Test users created successfully!"
echo ""
echo "📋 Test Accounts:"
echo "   Alex Frontend      | frontend.dev@example.com    | Frontend123!"
echo "   Jordan Advisor     | advisor@example.com         | Advisor123!"
echo "   Taylor Student     | student@example.com         | Student123!"
echo ""
echo "🚀 In development mode, you can also use the TestUsersManager component"
echo "   in the sidebar to quickly login with these accounts."
echo ""
echo "📚 Next steps:"
echo "   1. Start your development server: npm run dev"
echo "   2. Open http://localhost:3000"
echo "   3. In the sidebar, click '🧪 Development Test Users'"
echo "   4. Click 'Login' next to any test account"
