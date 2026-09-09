/**
 * ====================================================================
 * 🎂 DHANYA (BUNTYYYYYYYY) BIRTHDAY STORYBOOK - CONFIGURATION
 * 7 Interactive Scenes • Romantic, Sweet & Heartwarming
 * ====================================================================
 */

const _ENV = window.ENV || {};

window.BIRTHDAY_CONFIG = {
  // --- Personal Names ---
  recipientName: "Dhanya",
  nickname: "Buntyyyyyyyy",
  senderName: "Gowtham",

  // --- Photo & Graphic Assets ---
  // Real photos in the assets/ folder load via env.js to protect privacy
  assets: {
    roseBouquet: "assets/bouquet-3d.png",
    photoBestie: _ENV.PHOTO_BESTIE || "assets/photo-bestie.jpg",
    photoBestieFallback: "assets/photo-bestie.svg",
    albumArt: "assets/album-art.jpg",
    albumArtFallback: "assets/album-art.svg"
  },

  // --- Music Player Settings ---
  music: {
    title: "I Thought I Saw Your Face Today",
    artist: "She & Him • Dedicated to Buntyyyyyyyy ❤️",
    audioSrc: "assets/birthday-song.mp3"
  },

  // ==================================================================
  // SCENE 1 — OPENING
  // ==================================================================
  scene1: {
    tag: "FOR MY FAVORITE PERSON",
    heading: "Happy Birthday, Buntyyyyyyyy 💌",
    subheading: "A little storybook crafted with all my love, laughter & sweet memories.",
    buttonText: "Open My Gift 💌"
  },

  // ==================================================================
  // SCENE 2 — THE FRIENDSHIP METER (Interactive Gauge Quiz)
  // ==================================================================
  scene2: {
    badge: "SCENE 02 • THE FRIENDSHIP METER",
    title: "The Friendship Meter 💕",
    subtitle: "Slide to reveal the scientifically verified truth!",
    label: "Friendship Level",
    questions: [
      {
        question: "Be honest: how much do I value our friendship?",
        hint: "Anything under 100% is mathematically impossible."
      },
      {
        question: "How chaotic and wonderful are we together?",
        hint: "Think about every stomach-hurting laugh we shared."
      },
      {
        question: "How much brighter is my world with my best friend in it?",
        hint: "Infinity is literally the starting point here."
      }
    ],
    mascotFeedback: {
      step0: {
        text: "Only that much?! Unacceptable! 😭💔",
        subtext: "Wait... under 15%?! Teddy is heartbroken! Drag that slider up right now!",
        mood: "crying"
      },
      step15: {
        text: "Excuse me?! Still grumpy! 😤",
        subtext: "Are you testing my patience, Bunty? Our friendship is WAY stronger than this tiny sliver!",
        mood: "pouty"
      },
      step30: {
        text: "Bombastic Side-Eye... 👀",
        subtext: "What is this, a lukewarm review of your bestie? Keep dragging, I'm watching you!",
        mood: "sideeye"
      },
      step45: {
        text: "Hmm, getting warmer... 🤔",
        subtext: "Almost halfway! You're making progress, but you know our friendship is 100% unbreakable!",
        mood: "thinking"
      },
      step60: {
        text: "Aww, now we're talking! 🥰",
        subtext: "Look at you getting generous! That's more like my bestie, but don't stop now!",
        mood: "blushing"
      },
      step75: {
        text: "Ooooh yes! Look at that grin! 🤩",
        subtext: "So warm and full of joy! You're approaching the undeniable, absolute truth!",
        mood: "excited"
      },
      step90: {
        text: "SO CLOSE! Star eyes activated! 🌟💖",
        subtext: "90%+?! Almost there! Just one tiny millimeter more to 100%!",
        mood: "hearts"
      },
      step100: {
        text: "100% Best Friends Forever! 🎉👑",
        subtext: "You passed the test! You unlocked the next chapter, Bunty!",
        mood: "celebrating"
      }
    }
  },

  // ==================================================================
  // SCENE 3 — YOUR BOUQUET
  // ==================================================================
  scene3: {
    badge: "SCENE 03 • YOUR BOUQUET",
    title: "Flowers For You 💐",
    subtitle: "A few little truths that bloomed in my heart...",
    bubbles: [
      {
        icon: "🌹",
        text: "You make my heart bloom with pure joy every single day."
      },
      {
        icon: "💖",
        text: "I choose you always, even when you take 4 business days to reply to my memes."
      },
      {
        icon: "✨",
        text: "Every simple moment becomes magical when I'm sharing it with you."
      },
      {
        icon: "👑",
        text: "Having you as my best friend is the greatest blessing — wouldn't trade our bond for anything!"
      }
    ]
  },

  // ==================================================================
  // SCENE 4 — OUR MEMORY LANE (Polaroid + Music)
  // ==================================================================
  scene4: {
    badge: "SCENE 04 • MEMORY LANE",
    title: "Moments & Souvenirs 📸",
    subtitle: "Why are the most beautiful girls born on 13th September? (Like you ❤️)",
    polaroidCaption: "Why are the most beautiful girls born on 13 Sep? (Like you ❤️)",
    tickets: {
      pass: {
        tag: "BESTIE VIP PASS • 13TH SEP",
        title: "BESTIE PASS — ADMIT ONE TO MY HEART",
        subtitle: "BORN ON 13TH SEP (BEAUTIFUL LIKE YOU ❤️) • VALID FOREVER",
        perks: "• Unlimited Laughs\n• 24/7 Venting & Support Rights\n• 100% Free Food Sampling"
      }
    }
  },

  // ==================================================================
  // SCENE 5 — REASONS WHY WE ARE BEST FRIENDS (Interactive Card Deck)
  // ==================================================================
  scene5: {
    badge: "SCENE 05 • WHY WE ARE BEST FRIENDS",
    title: "Reasons Why We Are Best Friends 💖",
    subtitle: "Tap the card to flip! Use the arrows to browse all 5 reasons.",
    reasons: [
      {
        num: "01",
        title: "We Truly Understand Each Other",
        frontEmoji: "✨",
        front3dImage: "assets/reason-front-1.jpg",
        backEmoji: "💫",
        image: _ENV.REASON_1_PHOTO || "assets/reason-1.jpg",
        fallbackImage: "assets/photo-bestie.svg",
        objectPosition: "center 22%",
        text: "We understand each other without even needing words. That silent wavelength and deep connection we share is something truly rare and special."
      },
      {
        num: "02",
        title: "Exploring New Places Together",
        frontEmoji: "✈️",
        front3dImage: "assets/reason-front-2.jpg",
        backEmoji: "🗺️",
        image: _ENV.REASON_2_PHOTO || "assets/reason-2.jpg",
        fallbackImage: "assets/photo-bestie.svg",
        objectPosition: "center 62%",
        text: "We love visiting new places and wandering together. Every single trip and journey with you turns into an unforgettable, beautiful memory."
      },
      {
        num: "03",
        title: "We Love Eating Together",
        frontEmoji: "🍕",
        front3dImage: "assets/reason-front-3.jpg",
        backEmoji: "😋",
        image: _ENV.REASON_3_PHOTO || "assets/reason-3.jpg",
        fallbackImage: "assets/photo-bestie.svg",
        objectPosition: "center 22%",
        text: "Food just tastes a million times better when we share it together! From trying new dishes to our favorite cravings, every meal with you is pure happiness."
      },
      {
        num: "04",
        title: "When Nothing Feels Right, We Talk",
        frontEmoji: "💬",
        front3dImage: "assets/reason-front-4.jpg",
        backEmoji: "🤍",
        image: _ENV.REASON_4_PHOTO || "assets/reason-4.jpg",
        fallbackImage: "assets/photo-bestie.svg",
        objectPosition: "center 80%",
        text: "Whenever life gets tough or nothing feels good, all it takes is one conversation with you to make everything better. You are my comfort and safe space."
      },
      {
        num: "05",
        title: "Temple Visits & Endless Laughter",
        frontEmoji: "🙏",
        front3dImage: "assets/reason-front-5.jpg",
        backEmoji: "😂",
        image: _ENV.REASON_5_PHOTO || "assets/reason-5.jpg",
        fallbackImage: "assets/photo-bestie.svg",
        objectPosition: "center 65%",
        text: "We love visiting the temple together for peace and blessings, and sharing our uncontrollable laughs right after. That balance of spirituality and pure fun is why we're best friends."
      }
    ]
  },

  // ==================================================================
  // SCENE 6 — A LETTER FROM MY HEART
  // ==================================================================
  scene6: {
    badge: "SCENE 06 • FROM MY HEART",
    heading: "A Letter From My Heart 💌",
    date: "Special Birthday Edition • For Dhanya (Buntyyyyyyyy)",
    paragraphs: [
      "Happy Birthday, Buntyyyyyyyy! 🎂✨",
      "You make life feel so much more fun, ridiculous, and full of warmth in the best possible way. Having you by my side as my closest person and best friend is truly one of the greatest blessings.",
      "From our endless talks when nothing feels right to all our crazy food hunts and peaceful temple visits — you understand me without even needing words. I can't wait for a lifetime of more memories, uncontrollable laughs, and affectionately annoying you!",
      "Thank you for being uniquely, wonderfully you, and for always putting up with my nonsense. I hope this year brings you endless happiness, massive wins, and all your favorite food.",
      "Always in your corner, through thick and thin."
    ],
    signOff: "Your best friend always,",
    signature: "Gowtham"
  },

  // ==================================================================
  // SCENE 7 — CLOSING / FINALE
  // ==================================================================
  scene7: {
    badge: "SCENE 07 • HAPPY BIRTHDAY",
    heading: "Happy Birthday, Buntyyyyyyyy! 🎂❤️",
    closingLine: "🎉 Today, you are legally excused from doing anything you don't want to do. Go eat cake and smile! 🍰✨",
    replayText: "↺ Replay From The Beginning"
  }
};
