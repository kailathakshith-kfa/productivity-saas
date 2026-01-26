# How to Deploy KineticFlow AI

Since this is a Next.js application with Database (Supabase) and Authentication, the best way to host it for free is **Vercel**.

## Prerequisites
1.  **GitHub Account** (Free)
2.  **Vercel Account** (Free)

## Step 1: Push Code to GitHub
You need to put this code into a GitHub repository.
1.  Go to [github.com/new](https://github.com/new) and create a repository named `productivity-saas`.
2.  Run these commands in your terminal (stop the dev server first with `Ctrl+C`):
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/productivity-saas.git
    git push -u origin main
    ```

## Step 2: Deploy to Vercel
1.  Go to [vercel.com/new](https://vercel.com/new).
2.  Import your `productivity-saas` repository.
3.  **Environment Variables**: You MUST add these (copy them from your `.env.local` file):
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    *   `NEXT_PUBLIC_RAZORPAY_KEY_ID`
    *   `RAZORPAY_KEY_SECRET`
4.  Click **Deploy**.

## Step 3: Setup Production URL in Supabase
Once Vercel finishes, it will give you a URL (e.g., `https://productivity-saas.vercel.app`).
1.  Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Go to **Authentication > URL Configuration**.
3.  Add your new Vercel URL to **Site URL** and **Redirect URLs**.
    *   Site URL: `https://productivity-saas.vercel.app`
    *   Redirect URLs: `https://productivity-saas.vercel.app/**`

## Step 4: Add Custom Domain (Optional)
1.  In Vercel Dashboard, go to **Settings > Domains**.
2.  Enter your custom domain (e.g., `www.your-name.com`).
3.  Vercel will show you `A Records` or `CNAME` records.
4.  Login to where you bought your domain (GoDaddy, Namecheap) and add those records.
