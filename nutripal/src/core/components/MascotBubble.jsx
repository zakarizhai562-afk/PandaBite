// Shared mascot reaction bubble — avatar + speech bubble overlay
// Owned by Person 2. Used everywhere a mascot line appears.

export const MASCOT_WELCOME_BACK = {
  my: 'ပြန်လာတာ ကြိုဆိုပါတယ်! အဆင်သင့်ဖြစ်ရင် အတူတူ ကစားကြရအောင်!',
  en: "Welcome back. Let's play a friendly game when you're ready.",
};

export default function MascotBubble({ text, style }) {
  const displayText = text || MASCOT_WELCOME_BACK;

  return (
    <div className="mascot-bubble" style={style}>
      <div className="mascot-avatar">
        <svg viewBox="0 0 56 56" width="56" height="56">
          <circle cx="28" cy="28" r="28" fill="#C9673A" />
          <circle cx="28" cy="30" r="18" fill="#FFF3E0" />
          <circle cx="20" cy="26" r="4" fill="#1B2B22" />
          <circle cx="36" cy="26" r="4" fill="#1B2B22" />
          <circle cx="21" cy="25" r="1.5" fill="#fff" />
          <circle cx="37" cy="25" r="1.5" fill="#fff" />
          <ellipse cx="28" cy="32" rx="4" ry="2.5" fill="#4A2E23" />
        </svg>
      </div>
      <div className="mascot-speech">
        <p>{displayText.en}</p>
      </div>
    </div>
  );
}
