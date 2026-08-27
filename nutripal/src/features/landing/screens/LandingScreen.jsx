import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingScreen() {
  const navigate = useNavigate();

  const handleStart = useCallback(() => {
    navigate('/home');
  }, [navigate]);

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
