const fs = require('fs');
const path = require('path');

// Build script executed by Vercel during deployment.
// It injects environment variables configured in Vercel Dashboard into env.js.
// If not on Vercel, it defaults to safe public placeholders.

const envConfig = {
  PHOTO_BESTIE: process.env.PHOTO_BESTIE || "assets/photo-bestie.svg",
  REASON_1_PHOTO: process.env.REASON_1_PHOTO || "assets/photo-bestie.svg",
  REASON_2_PHOTO: process.env.REASON_2_PHOTO || "assets/photo-bestie.svg",
  REASON_3_PHOTO: process.env.REASON_3_PHOTO || "assets/photo-bestie.svg",
  REASON_4_PHOTO: process.env.REASON_4_PHOTO || "assets/photo-bestie.svg",
  REASON_5_PHOTO: process.env.REASON_5_PHOTO || "assets/photo-bestie.svg"
};

const content = `/**
 * 🔒 ENVIRONMENT CONFIGURATION
 * Generated automatically during deployment from private environment variables.
 * Includes domain protection: only authorized deployed domains access personal photos.
 */
(function() {
  const host = window.location.hostname;
  const isAuthorized = host === 'birthday-wishes-two-lovat.vercel.app' || 
                       host.endsWith('.vercel.app');

  if (isAuthorized) {
    window.ENV = ${JSON.stringify(envConfig, null, 2)};
  } else {
    // When downloaded from GitHub or run on localhost, strictly show default placeholders
    window.ENV = {
      PHOTO_BESTIE: "assets/photo-bestie.svg",
      REASON_1_PHOTO: "assets/photo-bestie.svg",
      REASON_2_PHOTO: "assets/photo-bestie.svg",
      REASON_3_PHOTO: "assets/photo-bestie.svg",
      REASON_4_PHOTO: "assets/photo-bestie.svg",
      REASON_5_PHOTO: "assets/photo-bestie.svg"
    };
  }
})();
`;

fs.writeFileSync(path.join(__dirname, 'env.js'), content, 'utf8');
console.log('Build complete: env.js generated successfully.');
