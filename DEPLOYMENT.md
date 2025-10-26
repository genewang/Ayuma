# Deployment Guide

## Prerequisites

1. **Supabase Account**: Create a project at [supabase.com](https://supabase.com)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Git Repository**: Push this code to GitHub, GitLab, or Bitbucket

## Supabase Setup

1. Create a new project on Supabase
2. Go to Settings → API to get your project URL and anon key
3. Run the SQL schema from `supabase-schema.sql` in the Supabase SQL Editor
4. Copy your environment variables:
   ```
   Project URL: https://your-project-id.supabase.co
   Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Vercel Deployment

### Option 1: Deploy from Git (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, Bitbucket)
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project"
4. Import your Git repository
5. Vercel will auto-detect the Vite configuration
6. Add environment variables in the Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Deploy!

### Option 2: Deploy from CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## Manual Deployment

If you prefer to deploy elsewhere:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Serve the dist folder** using any static hosting service:
   - Netlify
   - GitHub Pages
   - AWS S3 + CloudFront
   - Any web server

## Domain Configuration

- **Development**: http://localhost:3000
- **Production**: Your Vercel URL (e.g., https://your-app.vercel.app)

## Post-Deployment Checklist

- [ ] Supabase database is set up and running
- [ ] Environment variables are configured in production
- [ ] User authentication is working
- [ ] Roadmap saving/loading functionality works
- [ ] All features are accessible on mobile devices
- [ ] Performance is acceptable (check Core Web Vitals)

## Troubleshooting

### Common Issues

1. **"Cannot connect to Supabase"**
   - Check if your Supabase project is active
   - Verify environment variables are correct
   - Ensure RLS policies are set up correctly

2. **"Authentication failed"**
   - Check if email confirmation is enabled in Supabase
   - Verify the anon key is correct
   - Check browser console for detailed error messages

3. **"Build failed"**
   - Ensure all dependencies are installed: `npm install`
   - Check if there are TypeScript errors: `npm run lint`
   - Verify Node.js version (18+ recommended)

### Support

- **Supabase**: [supabase.com/support](https://supabase.com/support)
- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **React Flow**: [reactflow.dev](https://reactflow.dev)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
