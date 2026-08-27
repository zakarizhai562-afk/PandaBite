import { useState, useCallback } from 'react';

export default function LandingScreen() {
  const handleStart = useCallback(() => {
    // TODO: navigate to /home
  }, []);

  return (
    <div className="landing-screen">
      {/* Person 1's landing_page.png as full-screen background */}
      <img
        src="/world_art/landing_page.png"
        alt="NutriPal"
        className="landing-bg"
        onError={(e) => { e.target.style.display = 'none'; }}
      />
      <h1>NutriPal</h1>
      <button onClick={handleStart}>Start</button>
    </div>
  );
}
