# 🎂 Birthday Memory Experience — Developer & Deployment Guide

A luxury, interactive, multi-stage birthday memory experience created for **Shreya** (celebrating on **14 Sept**).

---

## 🚀 How to Publish This Website Online Using GitHub

You can publish this website online for free so that anyone (and especially Shreya!) can open and enjoy it on their phone, tablet, or laptop.

There are **two great ways** to publish from GitHub:
1. **Option 1: Deploy with GitHub Pages (100% inside GitHub)**
2. **Option 2: Deploy with Vercel or Netlify connected to GitHub (Easiest & Most Recommended for Vite/React)**

---

### Step 1: Make Sure Your Music and Photos Are in Place
Before pushing to GitHub, make sure your assets are inside the `public/` directory so they are included in your git commit and published live:
- 🎵 **Song**: Place your song file at `public/music.mp3`.
- 📸 **Photos**: Place all 16 photo files inside `public/photos/` (e.g. `IMG_20260819_211444_142.jpg`, etc.).

---

### Step 2: Create a New GitHub Repository
1. Log in to your [GitHub account](https://github.com/).
2. In the top-right corner, click the **`+`** icon and select **New repository**.
3. Name your repository (for example: `shreya-birthday` or `birthday-celebration`).
4. Choose **Public** (or **Private** if using Vercel/Netlify or GitHub Pro).
5. **Do not** initialize with a README, .gitignore, or license (we already have all project files ready).
6. Click **Create repository**.

---

### Step 3: Push Your Code to GitHub
Open your terminal inside your project folder and run the following commands:

```bash
# 1. Initialize git (if not already a git repository)
git init

# 2. Add all project files
git add .

# 3. Create your initial commit
git commit -m "Initial commit - Birthday Celebration for Shreya"

# 4. Set default branch to main
git branch -M main

# 5. Link your GitHub repository (replace with your actual GitHub URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# 6. Push your code
git push -u origin main
```

---

### Step 4: Choose How to Publish

#### 🌟 Option A: Deploy via GitHub Pages (Built directly in GitHub)

GitHub Pages automatically builds and hosts your Vite React app using GitHub Actions.

✅ **Already Done For You in This Project**:
- `base: './'` is already configured in `vite.config.ts`.
- Relative asset URL handling for photos and audio is configured.
- `package-lock.json` has been generated for clean CI/CD builds.
- The GitHub Actions workflow file is already in place at `.github/workflows/deploy.yml`.

All you need to do after pushing your repository is:

1. **Enable GitHub Pages in Your Repository**:
   - Go to your repository on GitHub (`https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME`).
   - Click the **Settings** tab at the top.
   - In the left sidebar, click **Pages**.
   - Under **Build and deployment** -> **Source**, select **GitHub Actions** (from the dropdown).
   - Click Save.

2. **Watch the Automatic Deployment**:
   - Click the **Actions** tab at the top of your GitHub repository.
   - You will see the **Deploy to GitHub Pages** workflow running.
   - In ~1-2 minutes, it will show a green checkmark!

3. **Your Live Website**:
   GitHub will provide your live URL right in **Settings** -> **Pages**:
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/
   ```

---

#### ⚡ Option B: Deploy via Vercel (Easiest & Most Recommended)

Vercel is free, connects directly to your GitHub repository, and automatically detects Vite React projects with zero extra configuration needed:

1. Go to [Vercel.com](https://vercel.com/) and click **Sign Up** or **Log In** with your **GitHub** account.
2. On your Vercel Dashboard, click **Add New...** -> **Project**.
3. Under **Import Git Repository**, find your birthday repo and click **Import**.
4. Vercel automatically detects **Vite** as the framework:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**.
6. In ~30 seconds, your site is live at:
   ```
   https://your-repository-name.vercel.app
   ```
   *(Whenever you push updates or new photos to your GitHub repo, Vercel updates the live website automatically).*

---

#### 🌐 Option C: Deploy via Netlify

Netlify is another excellent free platform:

1. Go to [Netlify.com](https://www.netlify.com/) and log in with GitHub.
2. Click **Add new site** -> **Import an existing project**.
3. Choose **GitHub** and select your repository.
4. Settings will automatically fill:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **Deploy site**.
6. Your site will be published at `https://your-site-name.netlify.app`.

---

### Step 5: Send the Link to Shreya! 🎉
Once published:
- The website is responsive and optimized for mobile screens, tablets, and laptops.
- Visitors can tap the golden **"Tap to play"** audio player dock at the bottom to enjoy the custom melody anytime.
- All 16 memories, scrapbook spreads, polaroids, and the 3D memory universe will be fully interactive.

---

## 🔒 Audio & Music Policy (Developer-Only Control)

> **Important**: The website is configured so that **visitors/users cannot change or upload music**.
>
> - **Visitor Controls**: End-users can only **Play / Pause**, **Mute / Unmute**, and adjust the **Volume** using the floating music dock in the bottom corner.
> - **Developer Control**: Only the developer sets the background track in the codebase. Every visitor hears the exact song you choose.

### How the Developer Sets or Changes the Music:

1. **Place your audio file**:
   Save your music file (e.g., `music.mp3`, `birthday-song.mp3`, or `.m4a`) inside the `public/` directory (for example, `public/music.mp3` or `public/audio/birthday.mp3`).
2. **Configure `src/data/config.ts`**:
   Open `src/data/config.ts` and set `musicUrl` and `musicTitle` inside `birthdayConfig`:
   ```typescript
   export const birthdayConfig: BirthdayConfig = {
     name: "Shreya",
     oldAge: 20,
     newAge: 21,
     dateLabel: "14 SEPT",
     subtitle: "May this 14th of September bring you endless reasons to smile, dream, and conquer.",
     footerText: "CELEBRATING SHREYA",
     musicUrl: "/music.mp3",
     musicTitle: "Endhayya Saami • Shreya's Birthday Melody",
     accentColor: "#ff9000",
   };
   ```
3. **Built-in Fallback Synth**:
   If no audio file is provided or if the file is still loading, the site automatically plays a gentle, ambient celesta/music box chime harmony of *Happy Birthday* so the experience is never silent.

---

## 📸 Steps to Use the Complete Folder of Images in the Project

The application is pre-configured to load all **16 photos of Shreya** from the `public/photos/` directory.

### Step 1: Destination Directory
All photos belong in:
```
public/photos/
```
*(Any file placed in `public/photos/filename.jpg` is automatically accessible in the browser at `/photos/filename.jpg` without any server configuration).*

### Step 2: Pre-Mapped Image Filenames
The following **16 photo filenames** are already mapped in `src/data/config.ts` with custom titles, dates, emojis, and notes:

| # | Filename | Memory Title | Stage Integration |
|---|---|---|---|
| 1 | `IMG_20260819_211444_142.jpg` | Triple The Smiles | Film Strip, Scrapbook Spread 1, 3D Universe |
| 2 | `IMG_20260904_110140_397.jpg` | Thumbs Up Vibe | Film Strip, Polaroid Wall, 3D Universe |
| 3 | `IMG_20260904_231701_885.jpg` | Pure Elegance | Film Strip, Scrapbook Spread 1, 3D Universe |
| 4 | `IMG_20260904_231704_927.jpg` | Golden Hour in Transit | Film Strip, Polaroid Wall, 3D Universe |
| 5 | `IMG_20260904_231707_134.jpg` | Sunshine Smile | Film Strip, Scrapbook Spread 2, 3D Universe |
| 6 | `IMG_20260904_231709_935.jpg` | Burger Chronicles | Film Strip, Polaroid Wall, 3D Universe |
| 7 | `IMG_20260904_231711_792.jpg` | Heart To Heart | Film Strip, Scrapbook Spread 2, 3D Universe |
| 8 | `IMG_20260904_231713_652.jpg` | Cafe Catchups | Film Strip, Polaroid Wall, 3D Universe |
| 9 | `IMG_20260904_231716_300.jpg` | Quiet Glow | Film Strip, Polaroid Wall, 3D Universe |
| 10 | `IMG_20260904_231718_975.jpg` | Jhumka & Tradition | Film Strip, Polaroid Wall, 3D Universe |
| 11 | `IMG_20260904_231721_010.jpg` | Pout & Polish | Film Strip, Polaroid Wall, 3D Universe |
| 12 | `IMG_20260904_231723_434.jpg` | Culture & Curiosity | Film Strip, Polaroid Wall, 3D Universe |
| 13 | `IMG_20260904_231804_491.jpg` | Bougainvillea Breeze | Film Strip, Polaroid Wall, 3D Universe |
| 14 | `IMG_20260904_231806_899.jpg` | Floral Whispers | Film Strip, Scrapbook Spread 3, 3D Universe |
| 15 | `IMG_20260904_231808_948.jpg` | Sunlit Aspirations | Film Strip, Polaroid Wall, 3D Universe |
| 16 | `IMG_20260904_231811_397.jpg` | Behind The Wheel | Film Strip, Scrapbook Spread 3, 3D Universe |

### Step 3: How to Upload / Copy the Complete Folder

- **In Google AI Studio / Web Interface**:
  1. Open the file explorer on the left.
  2. Expand `public/`, then select `photos/`.
  3. Drag and drop your complete folder or select all 16 `.jpg` image files into `public/photos/`.
- **In Local VS Code / Terminal**:
  Copy all files into `public/photos/`:
  ```bash
  # Example: Copying from your local downloads or pictures folder
  cp -r /path/to/your/photos/* ./public/photos/
  ```

---

## ⚙️ Implementing & Verifying After Changing the Images

Follow these steps every time you add, replace, or rename photos in the project:

### 1. Match Filenames in `src/data/config.ts`
If you used the exact 16 filenames listed above, **no code changes are needed** — they will load immediately!

If you use different filenames or add new photos, update `src/data/config.ts`:
```typescript
export const memories: Memory[] = [
  {
    id: "mem-1",
    filename: "your-photo-name.jpg",
    image: "/photos/your-photo-name.jpg", // Path in public/photos/
    title: "Triple The Smiles",
    subtitle: "Collage of moods",
    emoji: "🥹",
    date: "14 Sept",
    note: "Your personal note here...",
    aspectRatio: "portrait",
  },
  // Repeat for all memories...
];
```

### 2. Update the Scrapbook Spreads (Stage 5)
If you renamed images, also check the `scrapbookSpread` array in `src/data/config.ts`:
```typescript
export const scrapbookSpread: ScrapbookPageData[] = [
  {
    id: 1,
    title: "Chapter 21: Happy Birthday Shreya",
    photos: [
      {
        url: "/photos/IMG_20260819_211444_142.jpg", // Update to your image path
        caption: "Triple the smiles ✨",
        rotation: -3,
        position: { top: "10%", left: "8%", width: "44%" },
      },
      // ...
    ],
  },
  // ...
];
```

### 3. Build & Verify
Run the compilation check to ensure there are no syntax or typing issues:
```bash
npm run build
```
Vite will bundle the application and verify that all assets and TypeScript types resolve without errors.

### 4. Refresh Your Browser Preview
Because web browsers aggressively cache images:
1. Open the preview window or deployment link.
2. Perform a **hard refresh**:
   - **Windows/Linux**: `Ctrl + F5` or `Ctrl + Shift + R`
   - **macOS**: `Cmd + Shift + R`
3. Scroll through the stages to verify:
   - **Stage 3**: The curved 35mm film reel displays the photos.
   - **Stage 4**: The draggable polaroid stack displays the photos.
   - **Stage 5**: The dual-page 3D turning scrapbook displays the photos.
   - **Stage 6**: The 3D memory universe displays the photos.

### 5. Graceful Fallback Guarantee
Every photo card in the application is equipped with an automatic `onError` fallback handler. If an image file is missing, misspelled, or still uploading, the app displays a high-resolution curated aesthetic portrait instead of a broken image placeholder.

---

## 🗂️ Project Structure Overview

```
├── public/
│   ├── photos/              <-- 📸 Drop all 16 photo files here
│   │   ├── IMG_20260819_211444_142.jpg
│   │   ├── IMG_20260904_110140_397.jpg
│   │   └── ... (up to 16 photos)
│   └── music.mp3            <-- 🎵 Drop your background music file here
├── src/
│   ├── data/
│   │   └── config.ts        <-- 🌟 All names ("Shreya"), dates ("14 Sept"), and memories
│   ├── context/
│   │   └── MediaContext.tsx <-- Global audio player and memory provider
│   ├── components/
│   │   ├── MusicControl.tsx        <-- Floating visitor audio player (play/pause/volume)
│   │   ├── Stage1Intro.tsx         <-- Stage 1: 20 -> 21 odometer roll
│   │   ├── Stage2BirthdayReveal.tsx<-- Stage 2: Shreya's milestone reveal
│   │   ├── Stage3EditorialHero.tsx <-- Stage 3: Editorial layout & 14 Sept stamp
│   │   ├── CurvedFilmStrip.tsx     <-- Stage 3: Smooth moving 35mm film reel
│   │   ├── Stage4MemoryWall.tsx    <-- Stage 4: Draggable Polaroid card stack
│   │   ├── PolaroidCard.tsx        <-- Stage 4: Draggable card component
│   │   ├── Stage5Scrapbook.tsx     <-- Stage 5: Dual-page 3D turning album
│   │   ├── Stage6MemoryUniverse.tsx<-- Stage 6: Three.js 3D cosmos & 2D fallback
│   │   ├── MemoryModal.tsx         <-- Modal showing notes and dates for each memory
│   │   └── NavigationDots.tsx      <-- Quick stage navigator
│   ├── App.tsx              <-- Root application entry
│   └── types.ts             <-- Data structures & interfaces
└── metadata.json            <-- App metadata & permissions
```
