# GuidedPath - Career Path Visualization

A modern, interactive web application for career path visualization and planning. Built with React, TypeScript, React Flow, Tailwind CSS, and Supabase.

## Features

- **Interactive Career Graph**: Visual representation of career paths with draggable nodes
- **Role Details**: Comprehensive information about each role including salary ranges, requirements, and responsibilities
- **Skill Tracking**: Progress tracking for required skills with learning resources
- **User Authentication**: Sign up/in with Supabase for saving personal roadmaps
- **Roadmap Management**: Save, load, and manage multiple career roadmaps
- **Responsive Design**: Modern UI with Tailwind CSS styling

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Visualization**: React Flow
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL + Auth)
- **Build Tool**: Vite
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd guidedpath-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase:
- Create a new project on [Supabase](https://supabase.com)
- Copy your project URL and anon key to the `.env.local` file
- Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

The application requires the following tables in Supabase:

```sql
-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Roadmaps table
CREATE TABLE roadmaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  nodes JSONB NOT NULL,
  edges JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own roadmaps" ON roadmaps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own roadmaps" ON roadmaps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own roadmaps" ON roadmaps FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own roadmaps" ON roadmaps FOR DELETE USING (auth.uid() = user_id);

## Test Users Setup

The application includes test users for development and testing purposes.

### Quick Setup (Development Mode)

When running in development mode, a **TestUsersManager** component appears in the sidebar that allows you to quickly login with pre-configured test accounts.

#### Test Accounts Available:

| Name | Email | Password | Role |
|------|-------|----------|------|
| Alex Frontend | frontend.dev@example.com | Frontend123! | Frontend Developer |
| Jordan Advisor | advisor@example.com | Advisor123! | Career Advisor |
| Taylor Student | student@example.com | Student123! | Student |

#### Using Test Users:

1. Start the development server: `npm run dev`
2. Open http://localhost:3000
3. In the right sidebar, look for the **🧪 Development Test Users** section
4. Click the **Login** button next to any test account
5. The user will be automatically signed in

### Manual Setup (Supabase Dashboard)

Alternatively, you can create test users manually in your Supabase dashboard:

1. Go to **Authentication > Users** in your Supabase Dashboard
2. Click **Add User**
3. Create accounts with the emails and passwords listed above
4. The user profiles will be created automatically via database triggers

### Setup Script

For automated setup, you can run the included setup script:

```bash
# Install Supabase CLI first
npm install -g supabase

# Run the test users setup script
./setup-test-users.sh
```

Or use the npm script:

```bash
npm run setup-test-users
```

This script will create all test users in your Supabase database.

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── nodes/          # React Flow node components
│   ├── AuthModal.tsx   # Authentication modal
│   ├── RoadmapManager.tsx # Roadmap management
│   ├── RoleSidebar.tsx # Role details sidebar
│   └── SkillGraph.tsx  # Main React Flow component
├── hooks/              # Custom React hooks
│   └── useRoadmaps.ts  # Roadmap API hooks
├── lib/                # Utilities and configurations
│   ├── auth.tsx        # Authentication context
│   └── supabase.ts     # Supabase client
├── stores/             # Global state management
│   └── useAppStore.ts  # Zustand store
├── types/              # TypeScript type definitions
│   └── index.ts        # App types
└── data/               # Initial data
    └── initialData.ts  # Roles and skills data
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run setup-test-users` - Create test users in Supabase database

## Deployment

The application is configured for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard
4. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
