# Medical GuidedPath - AI-Powered Treatment Navigation

A modern, interactive web application for medical treatment navigation and care planning. Built with React, TypeScript, React Flow, Tailwind CSS, and Supabase.

## Features

- **Interactive Medical Flow**: Visual representation of treatment pathways with draggable nodes
- **Treatment Guidelines**: Up-to-date guidelines from ASCO, EULAR, NCCN, and ESMO institutions
- **Clinical Trial Finder**: Advanced trial matching with eligibility questionnaire and scoring
- **Patient Assistance**: Financial aid, support groups, insurance navigation, and specialist referrals
- **Medication Management**: Scheduling, interaction alerts, side-effect tracking, and pharmacy integration
- **User Authentication**: Sign up/in with Supabase for saving personal care plans
- **Care Plan Management**: Save, load, and manage multiple treatment roadmaps
- **Responsive Design**: Modern medical UI with Tailwind CSS styling

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
- Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor

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

-- Care plans table
CREATE TABLE care_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  patient_profile JSONB,
  nodes JSONB NOT NULL,
  edges JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Treatment guidelines from medical institutions
CREATE TABLE treatment_guidelines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  condition TEXT NOT NULL,
  stage TEXT NOT NULL,
  institution TEXT NOT NULL,
  recommendations JSONB,
  evidence_level TEXT,
  last_updated TIMESTAMPTZ,
  metadata JSONB
);

-- Clinical trials data (synced from ClinicalTrials.gov)
CREATE TABLE clinical_trials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nct_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  conditions TEXT[],
  eligibility_criteria JSONB,
  locations JSONB,
  phase TEXT,
  status TEXT,
  last_updated TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_guidelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_trials ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own care plans" ON care_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own care plans" ON care_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own care plans" ON care_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own care plans" ON care_plans FOR DELETE USING (auth.uid() = user_id);

-- Public read access for medical data
CREATE POLICY "Anyone can read treatment guidelines" ON treatment_guidelines FOR SELECT USING (true);
CREATE POLICY "Anyone can read clinical trials" ON clinical_trials FOR SELECT USING (true);
```

## Test Users Setup

The application includes test users for development and testing purposes.

### Quick Setup (Development Mode)

When running in development mode, a **TestUsersManager** component appears in the sidebar that allows you to quickly login with pre-configured test accounts.

#### Test Accounts Available:

| Name | Email | Password | Role |
|------|-------|----------|------|
| Dr. Sarah Chen | doctor.chen@example.com | Doctor123! | Oncologist |
| Maria Rodriguez | patient.rodriguez@example.com | Patient123! | Breast Cancer Patient |
| Dr. James Wilson | researcher.wilson@example.com | Research123! | Clinical Researcher |

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
│   │   ├── TreatmentNode.tsx    # Treatment guideline nodes
│   │   ├── TrialNode.tsx        # Clinical trial nodes
│   │   ├── AssistanceNode.tsx   # Patient assistance nodes
│   │   └── MedicationNode.tsx   # Medication management nodes
│   ├── panels/         # Feature panel components
│   │   ├── TreatmentPanel.tsx   # Treatment guidelines panel
│   │   ├── TrialPanel.tsx       # Clinical trials panel
│   │   ├── AssistancePanel.tsx  # Patient assistance panel
│   │   └── MedicationPanel.tsx  # Medication management panel
│   ├── AuthModal.tsx   # Authentication modal
│   ├── MedicalFlow.tsx # Main React Flow component
│   ├── MedicalSidebar.tsx # Medical details sidebar
│   ├── RoadmapManager.tsx # Care plan management
│   └── TestUsersManager.tsx # Development test users
├── hooks/              # Custom React hooks
│   └── useRoadmaps.ts  # Care plan API hooks
├── lib/                # Utilities and configurations
│   ├── auth.tsx        # Authentication context
│   └── supabase.ts     # Supabase client
├── stores/             # Global state management
│   ├── useAppStore.ts           # General app state
│   ├── useMedicalFlowStore.ts   # Medical flow state
│   ├── useTrialStore.ts         # Clinical trial state
│   ├── useUserStore.ts          # Patient profile state
│   └── useMedicationStore.ts    # Medication state
├── types/              # TypeScript type definitions
│   └── index.ts        # Medical data types
└── data/               # Initial data
    ├── initialData.ts  # Legacy career data
    └── medicalData.ts  # Medical sample data
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
3. Add your environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/medical-enhancement`
3. Commit your changes: `git commit -m 'Add medical feature'`
4. Push to the branch: `git push origin feature/medical-enhancement`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
