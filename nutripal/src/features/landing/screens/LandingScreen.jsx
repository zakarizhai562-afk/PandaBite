import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingScreen() {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const handleStart = useCallback(() => {
    navigate('/home');
  }, [navigate]);

  return (
    <div className="landing-screen">
      {!imgError && (
        <img
          src="/world_art/landing_page.png"
          alt="NutriPal"
          className="landing-bg"
          onError={() => setImgError(true)}
        />
      )}
      <h1>NutriPal</h1>
      <button className="btn-primary" onClick={handleStart}>
        Start
      </button>
    </div>
  );
}
