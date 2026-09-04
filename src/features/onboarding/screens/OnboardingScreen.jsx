import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { onboardingSlides } from '../models/onboardingContent';
import OnboardingPage from '../components/OnboardingPage';
import { getItem, setItem } from '../../../core/utils/storage';

export default function OnboardingScreen() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const total = onboardingSlides.length;
  const slide = onboardingSlides[index];
  const isLast = index === total - 1;

  const complete = useCallback(() => {
    const wasSeenBefore = !!getItem('hasSeenOnboarding');
    setItem('hasSeenOnboarding', true);
    if (wasSeenBefore) {
      if (window.history.length > 1) navigate(-1);
      else navigate('/home');
    } else {
      navigate('/landing');
    }
  }, [navigate]);

  const handleNext = useCallback(() => {
    if (isLast) {
      complete();
    } else {
      setIndex((i) => i + 1);
    }
  }, [isLast, complete]);

  const handleSkip = useCallback(() => {
    complete();
  }, [complete]);

  const handleDotClick = useCallback((i) => {
    setIndex(i);
  }, []);

  return (
    <div className="onboarding-screen">
      <div className="onboarding-card">
        <div className="onboarding-progress">
          {onboardingSlides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              className={`onboarding-dot ${i === index ? 'active' : ''} ${i < index ? 'done' : ''}`}
              onClick={() => handleDotClick(i)}
            />
          ))}
        </div>

        <OnboardingPage slide={slide} />

        <div className="onboarding-actions">
          {index >= 1 && !isLast && (
            <button className="btn-ghost" onClick={handleSkip}>
              Skip
            </button>
          )}
          <button className="btn-primary onboarding-next" onClick={handleNext}>
            {isLast ? 'Get Started' : 'Next'}
          </button>
        </div>

        <p className="onboarding-counter">
          {index + 1} / {total}
        </p>
      </div>
    </div>
  );
}
