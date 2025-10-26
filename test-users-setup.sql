-- Test Users Setup Script for GuidedPath
-- Run this in your Supabase SQL Editor to create test users

-- Note: This script creates test users in Supabase Auth
-- You'll need to run this in the Supabase Dashboard SQL Editor

-- Create test users (replace with actual emails and passwords)
-- These users will be created in the auth.users table

-- Test User 1: Frontend Developer
-- Email: frontend.dev@example.com
-- Password: Frontend123!

-- Test User 2: Career Advisor
-- Email: advisor@example.com
-- Password: Advisor123!

-- Test User 3: Student
-- Email: student@example.com
-- Password: Student123!

-- To create these users manually in Supabase Dashboard:
-- 1. Go to Authentication > Users in your Supabase Dashboard
-- 2. Click "Add User"
-- 3. Enter email and password for each test user
-- 4. The profile will be automatically created via the trigger

-- Or use Supabase CLI to create users programmatically:
-- supabase auth signup --email frontend.dev@example.com --password Frontend123!
-- supabase auth signup --email advisor@example.com --password Advisor123!
-- supabase auth signup --email student@example.com --password Student123!

-- After creating users, you can manually insert sample roadmaps:
INSERT INTO roadmaps (user_id, title, description, nodes, edges) VALUES
-- Frontend Developer Roadmap
(
  (SELECT id FROM auth.users WHERE email = 'frontend.dev@example.com'),
  'Frontend Career Path',
  'Complete roadmap from Junior to Senior Frontend Developer',
  '[
    {"id": "junior-frontend", "title": "Junior Frontend Developer", "position": {"x": 100, "y": 200}},
    {"id": "frontend-developer", "title": "Frontend Developer", "position": {"x": 400, "y": 200}},
    {"id": "senior-frontend", "title": "Senior Frontend Developer", "position": {"x": 700, "y": 200}}
  ]',
  '[
    {"id": "junior-to-frontend", "source": "junior-frontend", "target": "frontend-developer"},
    {"id": "frontend-to-senior", "source": "frontend-developer", "target": "senior-frontend"}
  ]'
),

-- Career Advisor Roadmap
(
  (SELECT id FROM auth.users WHERE email = 'advisor@example.com'),
  'Management Path',
  'Career progression into engineering management',
  '[
    {"id": "senior-frontend", "title": "Senior Frontend Developer", "position": {"x": 100, "y": 200}},
    {"id": "engineering-manager", "title": "Engineering Manager", "position": {"x": 400, "y": 200}},
    {"id": "cto", "title": "Chief Technology Officer", "position": {"x": 700, "y": 200}}
  ]',
  '[
    {"id": "senior-to-manager", "source": "senior-frontend", "target": "engineering-manager"},
    {"id": "manager-to-cto", "source": "engineering-manager", "target": "cto"}
  ]'
);
