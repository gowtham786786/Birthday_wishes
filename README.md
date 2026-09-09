# 🎂 Birthday Wishes - Interactive Storybook Web App

A heartwarming, interactive 7-scene birthday storybook web application crafted with pure HTML5, CSS3, and JavaScript.

## ✨ Features
- **Scene 1: The Grand Opening Envelope** with floating particles, letter preview, and confetti burst.
- **Scene 2: The Friendship Meter** with an interactive radial gauge, 100% threshold validation, and reactive 3D mascot feedback.
- **Scene 3: Luxury 3D Rose Bouquet** with floating micro-animations, floor contact shadow, and interactive falling petal bursts.
- **Scene 4: Memory Lane & Polaroid** with vintage tape, Bestie VIP ticket, and background music player.
- **Scene 5: 3D Reasons Flip Deck** featuring 3D Pixar-style artworks on the front and customizable personal memory photos on the back.
- **Scene 6: Heartfelt Letter** handwritten letter reveal with interactive bookmark.
- **Scene 7: Grand Finale** with floating celebratory balloons and dual confetti bursts.
- **Low-Score Warning & Skip Protection Pages** with 3D crying plush teddy animations.

---

## 🔒 Personal Photo Privacy & Deployment Setup

To protect personal privacy, real personal photos and personal URLs are **never committed to this repository**.

### 💻 Local Development & Extracted Clones:
- When running locally (or if anyone clones/extracts this repository), the application strictly displays safe, elegant vector illustrations (`photo-bestie.svg`).
- Personal photos are protected by domain authorization and will **never** be rendered on localhost or third-party clones.

### 🚀 Vercel Production Deployment:
1. Connect this repository to your **Vercel** account.
2. In your Vercel Project Dashboard, navigate to **Settings** ➔ **Environment Variables**.
3. Add the following 6 environment variables (or paste your `.env` file):
   - `PHOTO_BESTIE`: Scene 4 polaroid memory photo URL
   - `REASON_1_PHOTO`: Scene 5 Reason 1 card flip memory photo URL
   - `REASON_2_PHOTO`: Scene 5 Reason 2 card flip memory photo URL
   - `REASON_3_PHOTO`: Scene 5 Reason 3 card flip memory photo URL
   - `REASON_4_PHOTO`: Scene 5 Reason 4 card flip memory photo URL
   - `REASON_5_PHOTO`: Scene 5 Reason 5 card flip memory photo URL
4. On deployment, Vercel automatically injects these private variables into the live deployed link while keeping the public GitHub repository 100% clean and free of personal media.

---

## 🛠️ Tech Stack
- **Structure**: Semantic HTML5
- **Styling**: Vanilla CSS3 (Glassmorphism, 3D card transforms, keyframe animations)
- **Logic**: Vanilla JavaScript (Canvas confetti engine, reactive state, touch swipe & keyboard navigation)
- **Audio**: HTML5 Audio streaming
