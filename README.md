# FacePay UPI

A modern web application demonstrating a peer-to-peer payment concept where users can retrieve a recipient's UPI ID simply by scanning their face. Built with Next.js, React, and Supabase.

-----

## Features

  * **User Onboarding:** Simple email/password login, with support for Google OAuth, handled by Supabase Auth.
  * **Biometric UPI Linking:** Users register by linking their facial biometrics to their UPI ID. The app captures multiple scans and averages them into a single, robust vector embedding for accuracy.
  * **Instant UPI ID Retrieval:** Scan a registered user's face in real-time to instantly fetch their UPI ID, streamlining the payment process.
  * **Backend API:** Server-side logic handles the secure storage and retrieval of user data.
  * **Coder-Vibe UI:** A responsive, dark-themed dashboard designed with a modern, technical aesthetic, inspired by a command-line interface.

-----

## Tech Stack

  * **Framework:** [Next.js](https://nextjs.org/) / [React](https://reactjs.org/)
  * **Database & Auth:** [Supabase](https://supabase.com/)
  * **Facial Recognition:** [face-api.js](https://www.google.com/search?q=https://github.com/justadudewhohacks/face-api.js)
  * **Styling:** [Tailwind CSS](https://tailwindcss.com/)
  * **Language:** [TypeScript](https://www.typescriptlang.org/)

-----

## Getting Started

Follow these steps to get the project running locally.

### Prerequisites

  * Node.js (v18 or later)
  * npm or yarn
  * A Supabase account
  * A Google Cloud account (for OAuth)

### 1\. Clone the Repository

```bash
git clone <your-repository-url>
cd <repository-name>
```

### 2\. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3\. Set Up Supabase

1.  **Create a Supabase Project:** Go to [supabase.com](https://supabase.com) and create a new project.

2.  **Configure Google OAuth Provider:**

      * Go to the Google Cloud Console and create a new project.
      * Navigate to "APIs & Services" \> "Credentials".
      * Create an "OAuth 2.0 Client ID" for a "Web application".
      * In your Supabase project, go to "Authentication" \> "Providers" and enable Google.
      * Copy the **Redirect URL** from Supabase.
      * Back in Google Cloud, add the Supabase URL to your "Authorized redirect URIs".
      * Copy your **Client ID** and **Client Secret** from Google Cloud.
      * Paste them into the Google provider settings in Supabase and save.

3.  **Set up the Database Schema:** In the Supabase SQL Editor, run the following query to create the `faces` table.

    ```sql
    -- Create the faces table to store user embeddings and UPI info
    CREATE TABLE public.faces (
      id uuid NOT NULL DEFAULT gen_random_uuid(),
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      user_id uuid NOT NULL,
      email text NULL,
      face_embedding vector(128) NULL,
      name text NULL,
      upi_id text NULL,
      CONSTRAINT faces_pkey PRIMARY KEY (id),
      CONSTRAINT faces_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
    );

    -- Add a UNIQUE constraint to ensure one entry per user
    ALTER TABLE public.faces
    ADD CONSTRAINT faces_user_id_key UNIQUE (user_id);
    ```

4.  **Set Up Database Policies (RLS):** Run the following queries for a complete set of data access rules.

    ```sql
    -- 1. Enable RLS on the table
    ALTER TABLE public.faces ENABLE ROW LEVEL SECURITY;

    -- 2. Create policy for INSERT: Users can insert their own data.
    CREATE POLICY "Users can insert their own face data."
    ON public.faces FOR INSERT
    TO authenticated WITH CHECK (auth.uid() = user_id);

    -- 3. Create policy for SELECT: Users can view their own data.
    CREATE POLICY "Users can view their own face data."
    ON public.faces FOR SELECT
    TO authenticated USING (auth.uid() = user_id);

    -- 4. Create policy for UPDATE: Users can update their own data.
    CREATE POLICY "Users can update their own face data."
    ON public.faces FOR UPDATE
    TO authenticated USING (auth.uid() = user_id);

    -- 5. Create policy for DELETE: Users can delete their own data.
    CREATE POLICY "Users can delete their own face data."
    ON public.faces FOR DELETE
    TO authenticated USING (auth.uid() = user_id);
    ```

### 4\. Configure Environment Variables

Create a file named `.env.local` in the root of your project and add your Supabase credentials.

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role key
```

### 5\. Run the Development Server

```bash
npm run dev
```
