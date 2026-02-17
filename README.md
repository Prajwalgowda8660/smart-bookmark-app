# Smart Bookmark App 🚀

A simple full-stack bookmark manager built using **Next.js (App Router)**, **Supabase**, and **Tailwind CSS**, deployed on **Vercel**.

---

## 🔗 Live Demo

👉 https://smart-bookmark-app-kohl.vercel.app

---

## 🛠 Tech Stack

- **Frontend:** Next.js (App Router)
- **Authentication:** Supabase Auth (Google OAuth only)
- **Database:** Supabase Postgres
- **Realtime:** Supabase Realtime subscriptions
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

---

## ✅ Features

- 🔐 Google OAuth Login (No email/password)
- ➕ Add bookmark (Title + URL)
- 🔒 Bookmarks are private per user (Row Level Security enabled)
- 🔄 Realtime updates across tabs
- ❌ Delete own bookmarks
- ☁️ Fully deployed on Vercel

---

## 🧠 How It Works

- Supabase handles authentication via Google OAuth.
- Each bookmark stores a `user_id` referencing `auth.users`.
- Row Level Security (RLS) ensures:
  - Users can only see their own bookmarks.
  - Users can only insert/delete their own data.
- Realtime subscription listens to changes on the `bookmarks` table and updates UI instantly.
- Environment variables are configured securely in Vercel.

---

## 🗄 Database Schema

```sql
create table bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  url text not null,
  created_at timestamp with time zone default now()
);
🔐 RLS Policies

Users can SELECT their own rows

Users can INSERT rows where user_id = auth.uid()

Users can DELETE their own rows

⚠️ Challenges Faced & Solutions
1️⃣ Google OAuth configuration errors

Initially received:

Unsupported provider: provider is not enabled


Solution:

Enabled Google provider inside Supabase

Configured OAuth consent screen in Google Cloud

Properly set Authorized JavaScript Origin

Properly set Authorized Redirect URI

2️⃣ Redirect URI validation issues

Google required:

JavaScript origins without a path

Redirect URI including /auth/v1/callback

Solution:

Used base domain for JavaScript origin

Used full callback URL for redirect

3️⃣ Data privacy between users

Initially, data access needed to be restricted per user.

Solution:

Enabled Row Level Security (RLS)

Created strict policies using auth.uid()

4️⃣ Realtime updates across tabs

Requirement was to sync bookmarks between multiple open tabs without refresh.

Solution:

Implemented Supabase Realtime subscription

Listened for INSERT and DELETE events

Automatically refreshed bookmark list on change

🏁 Setup Instructions (Local Development)

Clone the repository

Install dependencies:

npm install


Create a .env.local file in the root folder:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_key


Run development server:

npm run dev


Open:

http://localhost:3000

📌 What I Learned

Implementing OAuth authentication using Supabase

Configuring Google Cloud OAuth credentials

Applying Row Level Security (RLS) for data protection

Using Supabase Realtime subscriptions

Deploying production apps on Vercel

Managing environment variables securely

Built with ❤️ using Next.js & Supabase.


---

✅ Now Final Steps

1. Save file (Ctrl + S)
2. Run:



git add README.md
git commit -m "Final README"
git push


---

After pushing, open your GitHub repo and confirm it looks clean.

You now have:
- Live deployed app
- Clean GitHub repo
- Professional README


