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

## 🔒 Personal Photo Privacy & Environment Setup

To protect personal privacy, real personal photos are never committed to this repository.

### Quick Setup:
1. Copy `env.example.js` to `env.js`:
   ```bash
   cp env.example.js env.js
   ```
2. Open `env.js` and specify your photos or image URLs for the 6 photo slots:
   - `PHOTO_BESTIE`: Scene 4 polaroid memory photo
   - `REASON_1_PHOTO` to `REASON_5_PHOTO`: The 5 photo memories revealed when flipping each card in Scene 5
3. Alternatively, copy `.env.example` to `.env` if using a build or server tool.
4. Launch the project using any local web server (e.g. `npx serve`, VSCode Live Server, or Python `python -m http.server 3000`).

---

## 🛠️ Tech Stack
- **Structure**: Semantic HTML5
- **Styling**: Vanilla CSS3 (Glassmorphism, 3D card transforms, keyframe animations)
- **Logic**: Vanilla JavaScript (Canvas confetti engine, reactive state, touch swipe & keyboard navigation)
- **Audio**: HTML5 Audio streaming
