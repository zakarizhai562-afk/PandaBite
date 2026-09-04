import MascotBubble from '../../../core/components/MascotBubble';

export default function OnboardingPage({ slide }) {
  const tierColor =
    slide.tier === 'Go' ? '#2D6A4F' : slide.tier === 'Slow' ? '#856404' : slide.tier === 'Whoa' ? '#721c24' : '#1B4332';
  const tierBg =
    slide.tier === 'Go' ? '#d4edda' : slide.tier === 'Slow' ? '#fff3cd' : slide.tier === 'Whoa' ? '#f8d7da' : '#EAF4EE';

  return (
    <div className="onboarding-page">
      <div className="onboarding-page-badge" style={{ background: tierBg, color: tierColor }}>
        {slide.badge.en}
      </div>
      <h2 className="onboarding-page-title">{slide.title.en}</h2>
      <div className="onboarding-mascot-wrap">
        <MascotBubble text={slide.text} />
      </div>
      <div className="onboarding-text-card">
        <p className="onboarding-text-my">{slide.text.my}</p>
        <p className="onboarding-text-en">{slide.text.en}</p>
      </div>
    </div>
  );
}
