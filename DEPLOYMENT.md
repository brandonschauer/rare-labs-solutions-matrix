# Deployment Instructions

This document explains how to deploy the AI Opportunity Map to make it publicly accessible.

## Option 1: Vercel (Recommended - Easiest)

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click "New Project"
3. Import your repository: `brandonschauer/rare-labs-solutions-matrix`
4. Vercel will auto-detect Vite settings - just click "Deploy"
5. Your app will be live at: `https://rare-labs-solutions-matrix.vercel.app` (or your custom domain)

**Advantages:**
- ✅ Automatic deployments on every push
- ✅ HTTPS included
- ✅ Custom domain support
- ✅ Zero configuration needed

## Option 2: Netlify

1. Go to [netlify.com](https://netlify.com) and sign in with GitHub
2. Click "Add new site" → "Import an existing project"
3. Select your repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy"

**Advantages:**
- ✅ Similar to Vercel
- ✅ Free tier available

## Option 3: GitHub Pages

1. Install the `gh-pages` package:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to `package.json` scripts:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. Update `vite.config.ts` to set the base path:
   ```typescript
   base: '/rare-labs-solutions-matrix/'
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

5. Go to repository Settings → Pages and ensure it's using the `gh-pages` branch

Your app will be at: `https://brandonschauer.github.io/rare-labs-solutions-matrix/`

## Option 4: Other Hosting Services

- **Cloudflare Pages**: Similar to Vercel/Netlify
- **AWS Amplify**: For AWS users
- **Firebase Hosting**: Google's hosting service

---

**Note:** Make sure your CSV file is in the `public/` folder (it is) so it gets included in the build.

