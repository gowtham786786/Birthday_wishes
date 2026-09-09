/**
 * ====================================================================
 * 🎂 DHANYA'S ROMANTIC BIRTHDAY STORYBOOK - APPLICATION LOGIC
 * 7 Interactive Scenes • Love Meter • 3D Flip Deck • Confetti & Audio
 * ====================================================================
 */

(function () {
  'use strict';

  const CFG = window.BIRTHDAY_CONFIG || {};

  // State
  let currentScene = 1;
  const totalScenes = 7;
  let currentQuestionIdx = 0;
  let currentReasonIdx = 0;
  let isPlayingAudio = false;
  let synthInterval = null;
  let audioContext = null;

  // DOM Elements
  const app = document.getElementById('storybookApp');
  const scenes = document.querySelectorAll('.scene-card');
  const dots = document.querySelectorAll('.progress-dot');
  const sceneStepLabel = document.getElementById('sceneStepLabel');
  const skipBtn = document.getElementById('skipBtn');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicIcon = document.getElementById('musicIcon');
  const bgAudio = document.getElementById('bgAudio');

  // Scene 1 Elements
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const openGiftBtn = document.getElementById('openGiftBtn');

  // Scene 2 Elements
  const questionCounter = document.getElementById('questionCounter');
  const questionText = document.getElementById('questionText');
  const gaugeNeedle = document.getElementById('gaugeNeedle');
  const gaugeFillArc = document.getElementById('gaugeFillArc');
  const gaugeScoreNum = document.getElementById('gaugeScoreNum');
  const meterSlider = document.getElementById('meterSlider');
  const mascotAvatar = document.getElementById('mascotAvatar');
  const mascotFace = document.getElementById('mascotFace');
  const mascotBubbleTitle = document.getElementById('mascotBubbleTitle');
  const mascotBubbleSub = document.getElementById('mascotBubbleSub');
  const meterNextBtn = document.getElementById('meterNextBtn');
  const meterNextBtnText = document.getElementById('meterNextBtnText');

  // Scene 3 Elements
  const speechBubblesCluster = document.getElementById('speechBubblesCluster');
  const bouquetNextBtn = document.getElementById('bouquetNextBtn');

  // Scene 4 Elements
  const memoryNextBtn = document.getElementById('memoryNextBtn');
  const playerPlayBtn = document.getElementById('playerPlayBtn');
  const playerPlayIcon = document.getElementById('playerPlayIcon');
  const playerAlbumArt = document.getElementById('playerAlbumArt');
  const equalizerBars = document.getElementById('equalizerBars');
  const playerProgressBar = document.getElementById('playerProgressBar');

  // Scene 5 Elements
  const flipCardWrapper = document.getElementById('flipCardWrapper');
  const deckCounter = document.getElementById('deckCounter');
  const cardNumTag = document.getElementById('cardNumTag');
  const card3dImg = document.getElementById('card3dImg');
  const cardFrontEmoji = document.getElementById('cardFrontEmoji');
  const cardFrontTitle = document.getElementById('cardFrontTitle');
  const cardBackEmoji = document.getElementById('cardBackEmoji');
  const cardBackPhoto = document.getElementById('cardBackPhoto');
  const cardReasonText = document.getElementById('cardReasonText');
  const deckPrevBtn = document.getElementById('deckPrevBtn');
  const deckNextBtn = document.getElementById('deckNextBtn');
  const reasonsNextBtn = document.getElementById('reasonsNextBtn');

  // Scene 6 Elements
  const letterParagraphs = document.getElementById('letterParagraphs');
  const letterNextBtn = document.getElementById('letterNextBtn');

  // Scene 7 Elements
  const finaleConfettiBtn = document.getElementById('finaleConfettiBtn');
  const replayBtn = document.getElementById('replayBtn');

  /* ===================================================================
     1. INITIALIZE & BIND DATA FROM CONFIG
     =================================================================== */
  function initData() {
    // Scene 1
    if (CFG.scene1) {
      if (CFG.scene1.tag) document.getElementById('scene1Tag').textContent = CFG.scene1.tag;
      if (CFG.scene1.heading) document.getElementById('landingTitle').textContent = CFG.scene1.heading;
      if (CFG.scene1.subheading) document.getElementById('landingSubtitle').textContent = CFG.scene1.subheading;
      if (CFG.scene1.buttonText) document.getElementById('scene1BtnText').textContent = CFG.scene1.buttonText;
    }

    // Scene 2 Badges & Initial Question
    if (CFG.scene2) {
      if (CFG.scene2.badge) document.getElementById('scene2Badge').textContent = CFG.scene2.badge;
      if (CFG.scene2.title) document.getElementById('meterTitle').textContent = CFG.scene2.title;
      if (CFG.scene2.subtitle) document.getElementById('meterSubtitle').textContent = CFG.scene2.subtitle;
      if (CFG.scene2.label) document.getElementById('gaugeScoreLabel').textContent = CFG.scene2.label;
      loadQuestion(0);
    }

    // Scene 3 Bouquet Bubbles
    if (CFG.scene3) {
      if (CFG.scene3.badge) document.getElementById('scene3Badge').textContent = CFG.scene3.badge;
      if (CFG.scene3.title) document.getElementById('bouquetTitle').textContent = CFG.scene3.title;
      if (CFG.scene3.subtitle) document.getElementById('bouquetSubtitle').textContent = CFG.scene3.subtitle;

      if (CFG.scene3.bubbles && speechBubblesCluster) {
        speechBubblesCluster.innerHTML = '';
        CFG.scene3.bubbles.forEach((item) => {
          const card = document.createElement('div');
          card.className = 'speech-bubble-card';
          card.innerHTML = `
            <span class="speech-bubble-icon">${item.icon || '🌹'}</span>
            <p class="speech-bubble-text">${escapeHtml(item.text)}</p>
          `;
          card.addEventListener('click', () => {
            playTone(659.25, 0.15, 'sine');
            spawnMiniSparkle(card);
            card.style.transform = 'scale(1.04) rotate(1deg)';
            setTimeout(() => card.style.transform = '', 300);
          });
          speechBubblesCluster.appendChild(card);
        });
      }
    }

    // Scene 4 Polaroid & Music
    if (CFG.scene4) {
      if (CFG.scene4.badge) document.getElementById('scene4Badge').textContent = CFG.scene4.badge;
      if (CFG.scene4.title) document.getElementById('memoryTitle').textContent = CFG.scene4.title;
      const memSub = document.getElementById('memorySubtitle');
      if (memSub && CFG.scene4.subtitle) memSub.textContent = CFG.scene4.subtitle;
      if (CFG.scene4.polaroidCaption) document.getElementById('polaroidCaption').textContent = CFG.scene4.polaroidCaption;
      if (CFG.assets && CFG.assets.photoBestie) {
        const bestiePhotoEl = document.getElementById('bestiePhoto');
        if (bestiePhotoEl) bestiePhotoEl.src = CFG.assets.photoBestie;
      }
      if (CFG.scene4.tickets && CFG.scene4.tickets.pass) {
        const pass = CFG.scene4.tickets.pass;
        const tagEl = document.querySelector('.romance-ticket .ticket-tag');
        const titleEl = document.querySelector('.romance-ticket .ticket-title');
        const subEl = document.querySelector('.romance-ticket .ticket-subtitle');
        if (tagEl && pass.tag) tagEl.textContent = pass.tag;
        if (titleEl && pass.title) titleEl.textContent = pass.title;
        if (subEl && pass.subtitle) subEl.textContent = pass.subtitle;
      }
    }

    if (CFG.music) {
      if (CFG.music.title) document.getElementById('playerTrackTitle').textContent = CFG.music.title;
      if (CFG.music.artist) document.getElementById('playerTrackArtist').textContent = CFG.music.artist;
      if (CFG.music.audioSrc) bgAudio.src = CFG.music.audioSrc;
    }

    // Scene 5 Reasons Deck
    if (CFG.scene5) {
      if (CFG.scene5.badge) document.getElementById('scene5Badge').textContent = CFG.scene5.badge;
      if (CFG.scene5.title) document.getElementById('reasonsTitle').textContent = CFG.scene5.title;
      if (CFG.scene5.subtitle) document.getElementById('reasonsSubtitle').textContent = CFG.scene5.subtitle;
      loadReasonCard(0);

      // On deployed Vercel domain, if env.js was not statically generated, fetch from secure serverless api
      const isDeployedHost = window.location.hostname === 'birthday-wishes-two-lovat.vercel.app' || 
                             window.location.hostname.endsWith('.vercel.app');
      if (isDeployedHost && (!CFG.assets.photoBestie || CFG.assets.photoBestie.includes('.svg'))) {
        fetch('/api/env')
          .then(res => res.json())
          .then(data => {
            if (data && data.PHOTO_BESTIE && !data.PHOTO_BESTIE.includes('.svg')) {
              CFG.assets.photoBestie = data.PHOTO_BESTIE;
              const bp = document.getElementById('bestiePhoto');
              if (bp) bp.src = data.PHOTO_BESTIE;
              if (CFG.scene5 && CFG.scene5.reasons) {
                CFG.scene5.reasons.forEach((r, i) => {
                  const k = `REASON_${i + 1}_PHOTO`;
                  if (data[k]) r.image = data[k];
                });
                loadReasonCard(currentReasonIdx);
              }
            }
          })
          .catch(() => {});
      }
    }

    // Scene 6 Letter
    if (CFG.scene6) {
      if (CFG.scene6.badge) document.getElementById('scene6Badge').textContent = CFG.scene6.badge;
      if (CFG.scene6.heading) document.getElementById('letterHeading').textContent = CFG.scene6.heading;
      if (CFG.scene6.date) document.getElementById('letterDate').textContent = CFG.scene6.date;
      if (CFG.scene6.signOff) document.getElementById('letterSignoff').textContent = CFG.scene6.signOff;
      if (CFG.senderName) document.getElementById('letterSignature').textContent = CFG.senderName;

      if (CFG.scene6.paragraphs && letterParagraphs) {
        letterParagraphs.innerHTML = '';
        CFG.scene6.paragraphs.forEach(text => {
          const p = document.createElement('p');
          p.className = 'letter-p';
          p.textContent = text;
          letterParagraphs.appendChild(p);
        });
      }
    }

    // Scene 7 Finale
    if (CFG.scene7) {
      if (CFG.scene7.badge) document.getElementById('scene7Badge').textContent = CFG.scene7.badge;
      if (CFG.scene7.heading) document.getElementById('finaleTitle').textContent = CFG.scene7.heading;
      if (CFG.scene7.closingLine) document.getElementById('finaleClosing').textContent = CFG.scene7.closingLine;
    }

    // Delicate Floating Stars & Hearts in Background (Kept strictly on side margins)
    createAmbientParticles();

    // Check if returning from reasons page or URL param
    const urlParams = new URLSearchParams(window.location.search);
    const sceneParam = urlParams.get('scene');
    if (sceneParam) {
      const sceneNum = parseInt(sceneParam, 10);
      if (sceneNum >= 1 && sceneNum <= totalScenes) {
        setTimeout(() => {
          goToScene(sceneNum);
        }, 150);
      }
    } else {
      // Check if returning from Low Love Warning or Skip page
      const fromLowLove = sessionStorage.getItem('dhanya_from_low_love');
      const savedQuestion = sessionStorage.getItem('dhanya_last_question');
      const savedScene = sessionStorage.getItem('dhanya_last_scene');

      if (savedScene) {
        sessionStorage.removeItem('dhanya_last_scene');
        const sceneNum = parseInt(savedScene, 10);
        if (sceneNum >= 1 && sceneNum <= totalScenes) {
          setTimeout(() => {
            goToScene(sceneNum);
            if (fromLowLove) {
              sessionStorage.removeItem('dhanya_from_low_love');
              if (savedQuestion !== null) {
                sessionStorage.removeItem('dhanya_last_question');
                loadQuestion(parseInt(savedQuestion, 10));
              }
              showLowLoveReturnToast();
            } else {
              showTeddyForgiveToast();
            }
          }, 300);
        }
      }
    }
  }

  function showTeddyForgiveToast() {
    const toast = document.createElement('div');
    toast.className = 'teddy-forgive-toast';
    toast.innerHTML = `<span>🧸</span><span>Teddy forgives you! Welcome back, Buntyyyyyyyy ❤️</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('visible'), 60);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  function showLowLoveReturnToast() {
    const toast = document.createElement('div');
    toast.className = 'teddy-forgive-toast';
    toast.innerHTML = `<span>🧸</span><span>Slide all the way to 100% now, Buntyyyyyyyy! Teddy is watching 🥺❤️</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('visible'), 60);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  /* ===================================================================
     2. SCENE SWITCHING & PROGRESS NAVIGATION
     =================================================================== */
  function goToScene(index) {
    if (index < 1 || index > totalScenes) return;

    scenes.forEach(scene => {
      const idx = parseInt(scene.getAttribute('data-index'), 10);
      if (idx === index) {
        scene.classList.remove('prev');
        scene.classList.add('active');
        scene.scrollTop = 0;
      } else if (idx < index) {
        scene.classList.remove('active');
        scene.classList.add('prev');
      } else {
        scene.classList.remove('active', 'prev');
      }
    });

    // Update progress dots and label
    dots.forEach((dot, i) => {
      const dotScene = i + 1;
      dot.classList.remove('active', 'completed');
      if (dotScene === index) {
        dot.classList.add('active');
      } else if (dotScene < index) {
        dot.classList.add('completed');
      }
    });

    if (sceneStepLabel) {
      sceneStepLabel.textContent = `${index}/${totalScenes}`;
    }

    currentScene = index;

    // Per-scene triggers
    if (index === 2) {
      resetGauge();
    } else if (index === 3) {
      triggerBouquetStagger();
      spawnBouquetPetals();
    } else if (index === 4) {
      // Start music automatically when reaching Scene 4 (Our Memory Lane & Music Player)
      if (!isPlayingAudio) {
        startMusicBox();
      }
    } else if (index === 6) {
      triggerLetterTypewriter();
    } else if (index === 7) {
      // Stop background music automatically on the final page
      stopMusicBox();
      if (bgAudio) {
        bgAudio.pause();
      }
      launchGrandFinale();
    }
  }

  function nextScene() {
    if (currentScene < totalScenes) {
      goToScene(currentScene + 1);
    } else {
      goToScene(1);
    }
  }

  // Dots click navigation
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = parseInt(dot.getAttribute('data-scene'), 10);
      goToScene(target);
    });
  });

  skipBtn.addEventListener('click', () => {
    sessionStorage.setItem('dhanya_last_scene', currentScene);
    window.location.href = 'skip.html';
  });

  // Scene 1 Envelope & Open Button
  function handleOpenGift() {
    envelopeWrapper.classList.add('opened');
    launchConfettiBurst(0.5, 0.6, 45);

    setTimeout(() => {
      goToScene(2);
    }, 650);
  }

  envelopeWrapper.addEventListener('click', handleOpenGift);
  openGiftBtn.addEventListener('click', handleOpenGift);

  function showToast(msg) {
    const existing = document.querySelector('.wish-made-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'wish-made-toast';
    toast.innerHTML = `<span>💐</span><span>${escapeHtml(msg)}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('visible'), 50);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, 2800);
  }

  // Scene 3 Bouquet Interactive Tap
  const bouquetCard = document.getElementById('bouquetCard');
  if (bouquetCard) {
    bouquetCard.addEventListener('click', () => {
      spawnBouquetPetals();
      showToast("A fresh shower of flower petals for Buntyyyyyyyy! 🌸💖");
    });
  }

  // Scene 3 Next Button
  if (bouquetNextBtn) {
    bouquetNextBtn.addEventListener('click', () => goToScene(4));
  }

  // Scene 4 Next Button
  if (memoryNextBtn) {
    memoryNextBtn.addEventListener('click', () => goToScene(5));
  }

  // Scene 5 Next Button
  if (reasonsNextBtn) {
    reasonsNextBtn.addEventListener('click', () => goToScene(6));
  }

  // Scene 6 Next Button
  if (letterNextBtn) {
    letterNextBtn.addEventListener('click', () => goToScene(7));
  }

  // Scene 7 Finale, Cake Wish & Replay
  const finaleCakeBadge = document.getElementById('finaleCakeBadge');
  const cakeWishHint = document.getElementById('cakeWishHint');

  function handleCakeWish() {
    if (!finaleCakeBadge) return;
    finaleCakeBadge.classList.remove('wish-burst');
    void finaleCakeBadge.offsetWidth;
    finaleCakeBadge.classList.add('wish-burst');

    playCelebrationChime();
    launchConfettiBurst(0.5, 0.35, 65);
    launchConfettiBurst(0.3, 0.5, 35);
    launchConfettiBurst(0.7, 0.5, 35);
    spawnWishSparkles(finaleCakeBadge);
    showWishToast();
  }

  if (finaleCakeBadge) finaleCakeBadge.addEventListener('click', handleCakeWish);
  if (cakeWishHint) cakeWishHint.addEventListener('click', handleCakeWish);

  function spawnWishSparkles(el) {
    const rect = el.getBoundingClientRect();
    const items = ['✨', '⭐', '💫', '🎉', '💖', '🎂', '🌸'];
    for (let i = 0; i < 16; i++) {
      setTimeout(() => {
        const s = document.createElement('span');
        s.textContent = items[i % items.length];
        s.style.position = 'fixed';
        s.style.left = `${rect.left + rect.width / 2 + (Math.random() * 60 - 30)}px`;
        s.style.top = `${rect.top + rect.height / 2 + (Math.random() * 40 - 20)}px`;
        s.style.fontSize = `${Math.random() * 10 + 20}px`;
        s.style.pointerEvents = 'none';
        s.style.zIndex = '99999';
        s.style.transition = 'all 1.1s cubic-bezier(0.2, 0.8, 0.3, 1)';
        s.style.opacity = '1';
        document.body.appendChild(s);

        requestAnimationFrame(() => {
          s.style.transform = `translate(${(Math.random() - 0.5) * 160}px, -${Math.random() * 120 + 40}px) scale(1.4) rotate(${Math.random() * 60 - 30}deg)`;
          s.style.opacity = '0';
        });

        setTimeout(() => s.remove(), 1150);
      }, i * 50);
    }
  }

  function showWishToast() {
    const existing = document.querySelector('.wish-made-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'wish-made-toast';
    toast.innerHTML = `<span>🌟</span><span>Wish Sent to the Universe! May it all come true, Buntyyyyyyyy! 💖🎂</span>`;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('visible'), 50);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  if (finaleConfettiBtn) {
    finaleConfettiBtn.addEventListener('click', () => {
      launchGrandFinale();
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      currentQuestionIdx = 0;
      loadQuestion(0);
      currentReasonIdx = 0;
      loadReasonCard(0);
      envelopeWrapper.classList.remove('opened');
      goToScene(1);
    });
  }

  /* ===================================================================
     3. SCENE 2: THE LOVE METER QUIZ & REACTIVE MASCOT
     =================================================================== */
  const questions = (CFG.scene2 && CFG.scene2.questions) || [
    { question: "Be honest: how much do I adore you?" },
    { question: "How chaotic and funny are we together?" },
    { question: "How much better is life with you in it?" }
  ];

  function loadQuestion(idx) {
    currentQuestionIdx = idx;
    const q = questions[idx];
    questionCounter.textContent = `QUESTION ${idx + 1} OF ${questions.length}`;
    questionText.textContent = q.question;
    resetGauge();

    if (idx === questions.length - 1) {
      meterNextBtnText.textContent = "Your Bouquet 💐 ›";
    } else {
      meterNextBtnText.textContent = "Next Question ›";
    }
  }

  function resetGauge() {
    meterSlider.value = 0;
    updateGauge(0);
    meterNextBtn.classList.remove('ready-100');
  }

  function updateGauge(val) {
    gaugeScoreNum.textContent = `${val}%`;

    // Semicircle needle: -90deg (at 0%) to +90deg (at 100%) around pivot (115px, 120px)
    const needleDeg = -90 + (val / 100) * 180;
    gaugeNeedle.style.transformOrigin = "115px 120px";
    gaugeNeedle.style.transform = `rotate(${needleDeg}deg)`;

    // Total arc perimeter ~ 276.5 (pi * 88)
    const maxOffset = 276.5;
    const currentOffset = maxOffset - (val / 100) * maxOffset;
    gaugeFillArc.style.strokeDashoffset = currentOffset;

    // Update Mascot Face & Speech
    updateMascotState(val);

    if (val === 100) {
      if (!meterNextBtn.classList.contains('ready-100')) {
        meterNextBtn.classList.add('ready-100');
        playTone(659.25, 0.15, 'sine');
        setTimeout(() => playTone(880, 0.25, 'sine'), 100);
        launchConfettiBurst(0.5, 0.45, 40);
        spawnGaugeHearts();
        if (navigator.vibrate) {
          try { navigator.vibrate([40, 60, 40]); } catch (e) {}
        }
      }
    } else {
      meterNextBtn.classList.remove('ready-100');
    }
  }

  function updateMascotState(val) {
    const fb = CFG.scene2 ? CFG.scene2.mascotFeedback : null;
    mascotAvatar.classList.remove('celebrating', 'mood-crying', 'mood-pouty', 'mood-sideeye', 'mood-thinking', 'mood-blushing', 'mood-excited', 'mood-hearts');

    if (val < 15) {
      // 1. Stage 0-14%: Dramatic heartbreak & sobbing waterfalls
      mascotAvatar.classList.add('mood-crying');
      mascotBubbleTitle.textContent = (fb && fb.step0 && fb.step0.text) || "Only that much?! Unacceptable! 😭💔";
      mascotBubbleSub.textContent = (fb && fb.step0 && fb.step0.subtext) || "Wait... under 15%?! My heart is literally shattered! Drag that slider up right now!";
      mascotFace.innerHTML = `
        <!-- Sad tilted eyebrows -->
        <path d="M 30 43 Q 36 39 42 45" stroke="#4c0519" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M 70 43 Q 64 39 58 45" stroke="#4c0519" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <!-- Crying squint eyes -->
        <path d="M 31 52 L 42 56" stroke="#4c0519" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M 69 52 L 58 56" stroke="#4c0519" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Flowing blue tears -->
        <ellipse cx="33" cy="65" rx="4.5" ry="7" fill="#38bdf8"/>
        <ellipse cx="67" cy="65" rx="4.5" ry="7" fill="#38bdf8"/>
        <circle cx="34" cy="74" r="2.5" fill="#38bdf8"/>
        <circle cx="66" cy="74" r="2.5" fill="#38bdf8"/>
        <!-- Trembling sad mouth -->
        <path d="M 43 69 Q 47 64 50 69 Q 53 64 57 69" stroke="#4c0519" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      `;
    } else if (val < 30) {
      // 2. Stage 15-29%: Grumpy pouting & steam anger
      mascotAvatar.classList.add('mood-pouty');
      mascotBubbleTitle.textContent = (fb && fb.step15 && fb.step15.text) || "Excuse me?! Still grumpy! 😤";
      mascotBubbleSub.textContent = (fb && fb.step15 && fb.step15.subtext) || "Are you testing my patience, Bunty? Our friendship is WAY stronger than this tiny sliver!";
      mascotFace.innerHTML = `
        <!-- Fierce angled eyebrows -->
        <line x1="30" y1="43" x2="43" y2="48" stroke="#4c0519" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="70" y1="43" x2="57" y2="48" stroke="#4c0519" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Glaring eyes -->
        <circle cx="38" cy="53" r="4.5" fill="#4c0519"/>
        <circle cx="40" cy="51" r="1.5" fill="#ffffff"/>
        <circle cx="62" cy="53" r="4.5" fill="#4c0519"/>
        <circle cx="64" cy="51" r="1.5" fill="#ffffff"/>
        <!-- Grumpy frown mouth -->
        <path d="M 43 68 Q 50 62 57 68" stroke="#4c0519" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <!-- Steam anger mark -->
        <path d="M 74 34 Q 78 30 82 34 Q 86 38 90 34" stroke="#f43f5e" stroke-width="2" fill="none" stroke-linecap="round"/>
        <line x1="76" y1="29" x2="84" y2="39" stroke="#f43f5e" stroke-width="2" stroke-linecap="round"/>
      `;
    } else if (val < 45) {
      // 3. Stage 30-44%: Suspicious Bombastic Side-Eye
      mascotAvatar.classList.add('mood-sideeye');
      mascotBubbleTitle.textContent = (fb && fb.step30 && fb.step30.text) || "Bombastic Side-Eye... 👀";
      mascotBubbleSub.textContent = (fb && fb.step30 && fb.step30.subtext) || "What is this, a lukewarm review of your bestie? Keep dragging, I'm watching you!";
      mascotFace.innerHTML = `
        <!-- Raised skeptical eyebrow -->
        <path d="M 32 41 Q 38 37 44 42" stroke="#4c0519" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <line x1="56" y1="46" x2="68" y2="46" stroke="#4c0519" stroke-width="2.2" stroke-linecap="round"/>
        <!-- Side-eye pupils glancing left -->
        <circle cx="38" cy="52" r="5.5" fill="#ffffff" stroke="#4c0519" stroke-width="1.5"/>
        <circle cx="35" cy="52" r="2.8" fill="#4c0519"/>
        <circle cx="62" cy="52" r="5.5" fill="#ffffff" stroke="#4c0519" stroke-width="1.5"/>
        <circle cx="59" cy="52" r="2.8" fill="#4c0519"/>
        <!-- Doubtful straight line mouth -->
        <line x1="45" y1="66" x2="55" y2="66" stroke="#4c0519" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Nervous sweat drop -->
        <ellipse cx="23" cy="46" rx="2" ry="4" fill="#38bdf8"/>
      `;
    } else if (val < 60) {
      // 4. Stage 45-59%: Curious Thinking & Halfway Pondering
      mascotAvatar.classList.add('mood-thinking');
      mascotBubbleTitle.textContent = (fb && fb.step45 && fb.step45.text) || "Hmm, getting warmer... 🤔";
      mascotBubbleSub.textContent = (fb && fb.step45 && fb.step45.subtext) || "Almost halfway! You're making progress, but you know our friendship is 100% unbreakable!";
      mascotFace.innerHTML = `
        <!-- Curious arched eyebrows -->
        <path d="M 33 42 Q 38 38 43 43" stroke="#4c0519" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M 57 43 Q 62 38 67 42" stroke="#4c0519" stroke-width="2" stroke-linecap="round" fill="none"/>
        <!-- Looking upward thinking eyes -->
        <circle cx="38" cy="52" r="5" fill="#4c0519"/>
        <circle cx="39" cy="49.5" r="2" fill="#ffffff"/>
        <circle cx="62" cy="52" r="5" fill="#4c0519"/>
        <circle cx="63" cy="49.5" r="2" fill="#ffffff"/>
        <!-- Pondering cute 'o' mouth -->
        <circle cx="50" cy="66" r="3.2" fill="#f43f5e" stroke="#4c0519" stroke-width="1.5"/>
        <!-- Idea spark -->
        <polygon points="50,16 52,21 57,23 52,25 50,30 48,25 43,23 48,21" fill="#f59e0b"/>
      `;
    } else if (val < 75) {
      // 5. Stage 60-74%: Sweet Blushing Smile & Rosy Cheeks
      mascotAvatar.classList.add('mood-blushing');
      mascotBubbleTitle.textContent = (fb && fb.step60 && fb.step60.text) || "Aww, now we're talking! 🥰";
      mascotBubbleSub.textContent = (fb && fb.step60 && fb.step60.subtext) || "Look at you getting generous! That's more like my bestie, but don't stop now!";
      mascotFace.innerHTML = `
        <!-- Soft gentle eyebrows -->
        <path d="M 33 43 Q 38 40 43 43" stroke="#4c0519" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M 57 43 Q 62 40 67 43" stroke="#4c0519" stroke-width="2" stroke-linecap="round" fill="none"/>
        <!-- Happy crescent eyes -->
        <path d="M 33 53 Q 38 46 43 53" stroke="#4c0519" stroke-width="2.8" stroke-linecap="round" fill="none"/>
        <path d="M 57 53 Q 62 46 67 53" stroke="#4c0519" stroke-width="2.8" stroke-linecap="round" fill="none"/>
        <!-- Extra rosy cheeks with blush marks -->
        <ellipse cx="28" cy="62" rx="7" ry="4" fill="#fb7185" opacity="0.8"/>
        <ellipse cx="72" cy="62" rx="7" ry="4" fill="#fb7185" opacity="0.8"/>
        <line x1="26" y1="60" x2="28" y2="64" stroke="#e11d48" stroke-width="1.2"/>
        <line x1="72" y1="60" x2="74" y2="64" stroke="#e11d48" stroke-width="1.2"/>
        <!-- Sweet warm smile -->
        <path d="M 44 64 Q 50 71 56 64" stroke="#4c0519" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <!-- Tiny floating heart -->
        <path d="M 76 38 C 76 35 73 33 71 35 C 69 33 66 35 66 38 C 66 41 71 45 71 45 C 71 45 76 41 76 38 Z" fill="#f43f5e"/>
      `;
    } else if (val < 90) {
      // 6. Stage 75-89%: Big Joyful Grin & Starry Sparkle Eyes
      mascotAvatar.classList.add('mood-excited');
      mascotBubbleTitle.textContent = (fb && fb.step75 && fb.step75.text) || "Ooooh yes! Look at that grin! 🤩";
      mascotBubbleSub.textContent = (fb && fb.step75 && fb.step75.subtext) || "So warm and full of joy! You're approaching the undeniable, absolute truth!";
      mascotFace.innerHTML = `
        <!-- High excited eyebrows -->
        <path d="M 32 39 Q 38 35 44 39" stroke="#4c0519" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <path d="M 56 39 Q 62 35 68 39" stroke="#4c0519" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <!-- Twinkling golden stars in eyes -->
        <polygon points="38,47 40,51 44,52 40,54 38,58 36,54 32,52 36,51" fill="#f59e0b"/>
        <circle cx="38" cy="52" r="1.5" fill="#ffffff"/>
        <polygon points="62,47 64,51 68,52 64,54 62,58 60,54 56,52 60,51" fill="#f59e0b"/>
        <circle cx="62" cy="52" r="1.5" fill="#ffffff"/>
        <!-- Big open joyful mouth with pink tongue -->
        <path d="M 42 62 Q 50 75 58 62 Z" fill="#f43f5e" stroke="#4c0519" stroke-width="1.8"/>
        <path d="M 46 68 Q 50 65 54 68 Q 50 74 46 68 Z" fill="#fda4af"/>
        <!-- Sparkles in air -->
        <polygon points="76,32 78,35 81,36 78,37 76,40 74,37 71,36 74,35" fill="#eab308"/>
      `;
    } else if (val < 100) {
      // 7. Stage 90-99%: Heart Eyes Adoration & Anticipation
      mascotAvatar.classList.add('mood-hearts');
      mascotBubbleTitle.textContent = (fb && fb.step90 && fb.step90.text) || "SO CLOSE! Star eyes activated! 🌟💖";
      mascotBubbleSub.textContent = (fb && fb.step90 && fb.step90.subtext) || "90%+?! Almost there! Just one tiny millimeter more to 100%!";
      mascotFace.innerHTML = `
        <!-- Excited arched eyebrows -->
        <path d="M 32 38 Q 38 34 44 39" stroke="#4c0519" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M 56 39 Q 62 34 68 38" stroke="#4c0519" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <!-- Giant glowing heart eyes -->
        <path d="M 38 46 C 38 42 34 40 31 43 C 28 40 24 42 24 46 C 24 51 31 56 31 56 C 31 56 38 51 38 46 Z" transform="translate(7, 4)" fill="#e11d48"/>
        <circle cx="36" cy="49" r="1.5" fill="#ffffff"/>
        <path d="M 38 46 C 38 42 34 40 31 43 C 28 40 24 42 24 46 C 24 51 31 56 31 56 C 31 56 38 51 38 46 Z" transform="translate(31, 4)" fill="#e11d48"/>
        <circle cx="60" cy="49" r="1.5" fill="#ffffff"/>
        <!-- Ecstatic gasp mouth -->
        <ellipse cx="50" cy="66" rx="6" ry="7" fill="#f43f5e" stroke="#4c0519" stroke-width="1.8"/>
        <ellipse cx="50" cy="69" rx="4" ry="3" fill="#fda4af"/>
        <!-- Floating adoration hearts -->
        <path d="M 22 36 C 22 33 19 32 17 34 C 15 32 12 33 12 36 C 12 39 17 43 17 43 C 17 43 22 39 22 36 Z" fill="#ec4899"/>
        <path d="M 86 36 C 86 33 83 32 81 34 C 79 32 76 33 76 36 C 76 39 81 43 81 43 C 81 43 86 39 86 36 Z" fill="#ec4899"/>
      `;
    } else {
      // 8. Stage 100%: 100% Ecstatic Party Hat & Crown Celebration
      mascotAvatar.classList.add('celebrating');
      mascotBubbleTitle.textContent = (fb && fb.step100 && fb.step100.text) || "100% Best Friends Forever! 🎉👑";
      mascotBubbleSub.textContent = (fb && fb.step100 && fb.step100.subtext) || "You passed the test! You unlocked the next chapter, Bunty!";
      mascotFace.innerHTML = `
        <!-- Golden Party Hat with Red Pom-pom -->
        <polygon points="40,24 60,24 50,2" fill="#f59e0b" stroke="#b45309" stroke-width="1"/>
        <circle cx="50" cy="2" r="3.5" fill="#f43f5e"/>
        <line x1="42" y1="18" x2="58" y2="18" stroke="#ec4899" stroke-width="2"/>
        <line x1="44" y1="12" x2="56" y2="12" stroke="#38bdf8" stroke-width="2"/>
        <!-- Starry curved happy eyes -->
        <path d="M 33 52 Q 38 45 43 52" stroke="#4c0519" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M 57 52 Q 62 45 67 52" stroke="#4c0519" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- Big open joyful mouth with pink tongue -->
        <path d="M 42 61 Q 50 76 58 61 Z" fill="#f43f5e" stroke="#4c0519" stroke-width="1.8"/>
        <path d="M 45 68 Q 50 65 55 68 Q 50 75 45 68 Z" fill="#fda4af"/>
        <!-- Confetti sparkles -->
        <polygon points="76,34 78,38 82,39 78,40 76,44 74,40 70,39 74,38" fill="#eab308"/>
        <polygon points="24,34 26,38 30,39 26,40 24,44 22,40 18,39 22,38" fill="#ec4899"/>
      `;
    }
  }

  meterSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    updateGauge(val);
  });

  meterNextBtn.addEventListener('click', () => {
    const currentVal = parseInt(meterSlider.value, 10);
    if (currentVal === 100) {
      if (currentQuestionIdx < questions.length - 1) {
        loadQuestion(currentQuestionIdx + 1);
      } else {
        goToScene(3);
      }
    } else {
      // User clicked Next Question without reaching 100%!
      sessionStorage.setItem('dhanya_last_scene', '2');
      sessionStorage.setItem('dhanya_last_question', currentQuestionIdx);
      sessionStorage.setItem('dhanya_low_percent', currentVal);
      sessionStorage.setItem('dhanya_from_low_love', 'true');
      window.location.href = `low-love.html?percent=${currentVal}&q=${currentQuestionIdx + 1}`;
    }
  });

  /* ===================================================================
     4. SCENE 3: BOUQUET STAGGERED REVEAL
     =================================================================== */
  function triggerBouquetStagger() {
    const bubbles = document.querySelectorAll('.speech-bubble-card');
    bubbles.forEach((b, i) => {
      b.classList.remove('popped-in');
      setTimeout(() => {
        b.classList.add('popped-in');
        playTone(440 + i * 65, 0.1, 'sine');
      }, (i + 1) * 220);
    });
  }

  /* ===================================================================
     5. SCENE 5: REASONS I LOVE YOU (3D FLIP CARD DECK)
     =================================================================== */
  const reasonsList = (CFG.scene5 && CFG.scene5.reasons) || [];

  function loadReasonCard(idx) {
    if (idx < 0 || idx >= reasonsList.length) return;
    currentReasonIdx = idx;
    const r = reasonsList[idx];

    // Unflip first
    flipCardWrapper.classList.remove('flipped');

    setTimeout(() => {
      deckCounter.textContent = `REASON ${r.num} OF ${String(reasonsList.length).padStart(2, '0')}`;
      cardNumTag.textContent = `REASON #${r.num}`;
      if (card3dImg) {
        card3dImg.src = r.front3dImage || `assets/reason-front-${idx + 1}.jpg`;
        card3dImg.alt = `3D Artwork: ${r.title}`;
      }
      if (cardFrontEmoji) cardFrontEmoji.textContent = r.frontEmoji || "💖";
      cardFrontTitle.textContent = r.title;
      cardBackEmoji.textContent = r.backEmoji || "✨";
      cardReasonText.textContent = r.text;

      if (cardBackPhoto) {
        cardBackPhoto.onerror = function() {
          this.onerror = null;
          this.src = r.fallbackImage || (CFG.assets && CFG.assets.photoBestieFallback) || 'assets/photo-bestie.svg';
        };
        cardBackPhoto.style.objectPosition = r.objectPosition || 'center 20%';
        cardBackPhoto.src = r.image || `assets/reason-${parseInt(r.num, 10)}.jpg`;
      }

      // Update button disabled states
      deckPrevBtn.disabled = idx === 0;
      deckNextBtn.disabled = idx === reasonsList.length - 1;
    }, 150);
  }

  // Tap to flip card
  flipCardWrapper.addEventListener('click', () => {
    flipCardWrapper.classList.toggle('flipped');
    playTone(523.25, 0.12, 'triangle');
    spawnMiniSparkle(flipCardWrapper);
  });

  deckPrevBtn.addEventListener('click', () => {
    if (currentReasonIdx > 0) {
      loadReasonCard(currentReasonIdx - 1);
    }
  });

  deckNextBtn.addEventListener('click', () => {
    if (currentReasonIdx < reasonsList.length - 1) {
      loadReasonCard(currentReasonIdx + 1);
    }
  });

  /* ===================================================================
     6. SCENE 6: TYPEWRITER REVEAL FOR LETTER
     =================================================================== */
  function triggerLetterTypewriter() {
    const paras = document.querySelectorAll('.letter-p');
    paras.forEach((p, i) => {
      p.style.opacity = '0';
      p.style.transform = 'translateY(8px)';
      setTimeout(() => {
        p.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        p.style.opacity = '1';
        p.style.transform = 'translateY(0)';
      }, (i + 1) * 260);
    });
  }

  /* ===================================================================
     7. SCENE 7: GRAND FINALE
     =================================================================== */
  function launchGrandFinale() {
    launchConfettiBurst(0.2, 0.6, 75);
    launchConfettiBurst(0.8, 0.6, 75);
    setTimeout(() => launchConfettiBurst(0.5, 0.35, 90), 250);
    spawnFloatingBalloons();
    playCelebrationChime();
  }

  /* ===================================================================
     8. AUDIO ENGINE (MP3 BACKGROUND SONG ONLY)
     =================================================================== */
  function getAudioContext() {
    return null;
  }

  // Disabled: removed all synthesized tik-tik-tik tones and sounds everywhere
  function playTone(freq, duration = 0.2, type = 'sine') {
    return;
  }

  function playCelebrationChime() {
    return;
  }

  function startMusicBox() {
    isPlayingAudio = true;
    musicToggleBtn.classList.add('playing');
    musicIcon.textContent = '🔊';
    playerPlayIcon.textContent = '❚❚';
    playerAlbumArt.classList.add('spinning');
    equalizerBars.classList.add('active');

    if (bgAudio && bgAudio.src && bgAudio.src !== window.location.href) {
      bgAudio.play().catch(() => {
        // If autoplay policy blocks audio until user interaction, start on next tap/click
        const unlockAudio = () => {
          if (isPlayingAudio && bgAudio && bgAudio.paused) {
            bgAudio.play().catch(() => {});
          }
          ['click', 'touchstart', 'pointerdown', 'keydown'].forEach(evt => {
            window.removeEventListener(evt, unlockAudio, { capture: true });
          });
        };
        ['click', 'touchstart', 'pointerdown', 'keydown'].forEach(evt => {
          window.addEventListener(evt, unlockAudio, { capture: true, once: true });
        });
      });
    }
    startProgressSimulator();
  }

  function startSynthLoop() {
    // Disabled: removed synthetic tik-tik-tik melody loop
    if (synthInterval) clearInterval(synthInterval);
  }

  function stopMusicBox() {
    isPlayingAudio = false;
    musicToggleBtn.classList.remove('playing');
    musicIcon.textContent = '🎵';
    playerPlayIcon.textContent = '▶';
    playerAlbumArt.classList.remove('spinning');
    equalizerBars.classList.remove('active');

    if (bgAudio) bgAudio.pause();
    if (synthInterval) clearInterval(synthInterval);
  }

  function toggleMusic() {
    if (isPlayingAudio) {
      stopMusicBox();
    } else {
      startMusicBox();
    }
  }

  musicToggleBtn.addEventListener('click', toggleMusic);
  playerPlayBtn.addEventListener('click', toggleMusic);

  if (bgAudio) {
    bgAudio.addEventListener('timeupdate', () => {
      if (bgAudio.duration && !isNaN(bgAudio.duration)) {
        const pct = (bgAudio.currentTime / bgAudio.duration) * 100;
        playerProgressBar.style.width = `${pct}%`;
      }
    });
    bgAudio.addEventListener('ended', () => {
      bgAudio.currentTime = 0;
      bgAudio.play();
    });
  }

  let progressSim = 0;
  function startProgressSimulator() {
    setInterval(() => {
      if (isPlayingAudio && (!bgAudio || !bgAudio.duration || isNaN(bgAudio.duration))) {
        progressSim = (progressSim + 1) % 100;
        playerProgressBar.style.width = `${progressSim}%`;
      }
    }, 600);
  }

  /* ===================================================================
     9. PARTICLES, CONFETTI & FLOATING BALLOONS
     =================================================================== */
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const confettiColors = ['#f43f5e', '#fb7185', '#fda4af', '#f59e0b', '#fbbf24', '#34d399', '#60a5fa', '#c084fc'];

  function launchConfettiBurst(normX, normY, count = 40) {
    const x = normX * canvas.width;
    const y = normY * canvas.height;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 8 + 4,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 10 - 5,
        opacity: 1,
        life: 0,
        maxLife: Math.random() * 60 + 50
      });
    }

    if (!animId) updateParticles();
  }

  function updateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25;
      p.vx *= 0.98;
      p.rotation += p.rotSpeed;
      p.life++;
      p.opacity = 1 - (p.life / p.maxLife);

      if (p.opacity <= 0 || p.y > canvas.height + 20) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;

      if (i % 2 === 0) {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    if (particles.length > 0) {
      animId = requestAnimationFrame(updateParticles);
    } else {
      animId = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function spawnMiniSparkle(targetEl) {
    const rect = targetEl.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    launchConfettiBurst(x, y, 12);
  }

  function spawnFloatingBalloons() {
    const items = ['🎈', '💖', '🎂', '✨', '🎉', '🌹', '💌', '🍰'];
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const balloon = document.createElement('div');
        balloon.textContent = items[Math.floor(Math.random() * items.length)];
        balloon.style.position = 'fixed';
        balloon.style.left = `${Math.random() * 85 + 5}%`;
        balloon.style.bottom = '-50px';
        balloon.style.fontSize = `${Math.random() * 20 + 28}px`;
        balloon.style.zIndex = '1000';
        balloon.style.pointerEvents = 'none';
        balloon.style.transition = 'transform 3.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 3.5s ease-out';
        balloon.style.transform = `translateY(0) rotate(${Math.random() * 40 - 20}deg)`;

        document.body.appendChild(balloon);

        requestAnimationFrame(() => {
          balloon.style.transform = `translateY(-${window.innerHeight + 160}px) rotate(${Math.random() * 60 - 30}deg)`;
          balloon.style.opacity = '0';
        });

        setTimeout(() => balloon.remove(), 3600);
      }, i * 120);
    }
  }

  // Subtle floating ambient particles strictly on the side margins
  function createAmbientParticles() {
    const container = document.getElementById('ambientBg');
    if (!container) return;
    const items = ['✨', '💖', '🌸', '⭐'];

    for (let i = 0; i < 8; i++) {
      const p = document.createElement('span');
      p.className = 'floating-particle';
      p.textContent = items[i % items.length];
      // Keep strictly to the left (0-15%) or right (85-98%) margins so they never clash with cards!
      const isLeft = i % 2 === 0;
      p.style.left = isLeft ? `${Math.random() * 12}%` : `${88 + Math.random() * 10}%`;
      p.style.fontSize = `${Math.random() * 6 + 11}px`;
      p.style.animationDuration = `${Math.random() * 6 + 12}s`;
      p.style.animationDelay = `${Math.random() * 8}s`;
      container.appendChild(p);
    }
  }

  /* ===================================================================
     10. MOBILE TOUCH SWIPE SUPPORT
     =================================================================== */
  let touchStartX = 0;
  let touchStartY = 0;

  app.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  app.addEventListener('touchend', (e) => {
    if (e.target.closest('.custom-range') || e.target.closest('button') || e.target.closest('.flip-card-wrapper')) return;

    const diffX = touchStartX - e.changedTouches[0].screenX;
    const diffY = touchStartY - e.changedTouches[0].screenY;

    if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      if (diffX > 0) {
        if (currentScene === 2 && !meterNextBtn.classList.contains('visible')) return;
        nextScene();
      } else {
        if (currentScene > 1) goToScene(currentScene - 1);
      }
    }
  }, { passive: true });

  /* ===================================================================
     11. DELIGHT ANIMATIONS: FAIRY DUST, HEARTS & PETALS
     =================================================================== */
  // 1. Fairy dust trail following cursor and touch
  let lastSparkleTime = 0;
  function spawnCursorSparkle(x, y) {
    const now = Date.now();
    if (now - lastSparkleTime < 50) return;
    lastSparkleTime = now;

    const sparkle = document.createElement('span');
    const items = ['✨', '💖', '🌸', '💫', '⭐'];
    sparkle.textContent = items[Math.floor(Math.random() * items.length)];
    sparkle.className = 'fairy-cursor-sparkle';
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    sparkle.style.fontSize = `${Math.random() * 6 + 12}px`;
    document.body.appendChild(sparkle);

    const destX = (Math.random() - 0.5) * 36;
    const destY = -Math.random() * 30 - 15;

    requestAnimationFrame(() => {
      sparkle.style.transform = `translate(${destX}px, ${destY}px) scale(${Math.random() * 0.4 + 0.8}) rotate(${Math.random() * 60 - 30}deg)`;
      sparkle.style.opacity = '0';
    });

    setTimeout(() => sparkle.remove(), 650);
  }

  window.addEventListener('pointermove', (e) => {
    spawnCursorSparkle(e.clientX, e.clientY);
  }, { passive: true });

  // 2. Love Meter 100% Heart Fountain
  function spawnGaugeHearts() {
    const gaugeEl = document.querySelector('.gauge-meter-wrapper');
    if (!gaugeEl) return;
    const rect = gaugeEl.getBoundingClientRect();
    const hearts = ['❤️', '💖', '💕', '🥰', '✨'];

    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const h = document.createElement('span');
        h.textContent = hearts[i % hearts.length];
        h.style.position = 'fixed';
        h.style.left = `${rect.left + rect.width / 2 + (Math.random() * 40 - 20)}px`;
        h.style.top = `${rect.top + rect.height / 2}px`;
        h.style.fontSize = `${Math.random() * 8 + 18}px`;
        h.style.pointerEvents = 'none';
        h.style.zIndex = '9999';
        h.style.transition = 'all 1.2s cubic-bezier(0.2, 0.8, 0.3, 1)';
        h.style.opacity = '1';
        document.body.appendChild(h);

        requestAnimationFrame(() => {
          h.style.transform = `translate(${(Math.random() - 0.5) * 120}px, -${Math.random() * 90 + 50}px) scale(1.3) rotate(${Math.random() * 40 - 20}deg)`;
          h.style.opacity = '0';
        });

        setTimeout(() => h.remove(), 1250);
      }, i * 90);
    }
  }

  // 3. Falling Rose Petals in Scene 3
  function spawnBouquetPetals() {
    const bouquetContainer = document.querySelector('.bouquet-illustration-card');
    if (!bouquetContainer) return;
    const petals = ['🌸', '🌺', '✨', '🌹'];

    for (let i = 0; i < 6; i++) {
      const p = document.createElement('span');
      p.className = 'floating-petal';
      p.textContent = petals[i % petals.length];
      p.style.left = `${Math.random() * 80 + 10}%`;
      p.style.top = '-10px';
      p.style.fontSize = `${Math.random() * 6 + 14}px`;
      p.style.animationDuration = `${Math.random() * 3 + 4}s`;
      p.style.animationDelay = `${i * 0.45}s`;
      bouquetContainer.appendChild(p);

      setTimeout(() => p.remove(), 8000);
    }
  }

  // Boot
  document.addEventListener('DOMContentLoaded', initData);

})();
