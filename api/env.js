module.exports = (req, res) => {
  // Set CORS and caching headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

  // Verify host to protect personal photos
  const host = req.headers['x-forwarded-host'] || req.headers.host || '';
  const isAuthorized = host === 'birthday-wishes-two-lovat.vercel.app' || host.endsWith('.vercel.app');

  // If accessed from unauthorized host (or localhost clone), return public placeholders
  if (!isAuthorized) {
    return res.status(200).json({
      PHOTO_BESTIE: "assets/photo-bestie.svg",
      REASON_1_PHOTO: "assets/photo-bestie.svg",
      REASON_2_PHOTO: "assets/photo-bestie.svg",
      REASON_3_PHOTO: "assets/photo-bestie.svg",
      REASON_4_PHOTO: "assets/photo-bestie.svg",
      REASON_5_PHOTO: "assets/photo-bestie.svg"
    });
  }

  // Deployed Vercel domain receives photo URLs exclusively from Vercel Environment Variables
  return res.status(200).json({
    PHOTO_BESTIE: process.env.PHOTO_BESTIE || "assets/photo-bestie.svg",
    REASON_1_PHOTO: process.env.REASON_1_PHOTO || "assets/photo-bestie.svg",
    REASON_2_PHOTO: process.env.REASON_2_PHOTO || "assets/photo-bestie.svg",
    REASON_3_PHOTO: process.env.REASON_3_PHOTO || "assets/photo-bestie.svg",
    REASON_4_PHOTO: process.env.REASON_4_PHOTO || "assets/photo-bestie.svg",
    REASON_5_PHOTO: process.env.REASON_5_PHOTO || "assets/photo-bestie.svg"
  });
};
