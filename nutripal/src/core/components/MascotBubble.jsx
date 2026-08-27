// Shared mascot reaction bubble — avatar + speech bubble overlay
// Owned by Person 2. Used everywhere a mascot line appears:
// - Puzzle per-item reactions (Person 4)
// - Daily Log per-item reactions (Person 2)
// - Goals feeding mini-game reactions (Person 3)
// - Combo Guess reveal (Person 3)

// Default idle greeting — shown when no specific reaction is provided
export const MASCOT_WELCOME_BACK = {
  my: 'ပြန်လာတာ ကြိုဆိုပါတယ်! အဆင်သင့်ဖြစ်ရင် အတူတူ ကစားကြရအောင်!',
  en: 'Welcome back. Let\'s play a friendly game when you\'re ready.',
};

export default function MascotBubble({ text }) {
  const displayText = text || MASCOT_WELCOME_BACK;
  return (
    <div>
      {/* Circular mascot portrait (cropped from reaction sprite) */}
      <div className="mascot-avatar" />
      {/* Rounded speech bubble */}
      <div className="mascot-speech">
        <p>{displayText.en}</p>
      </div>
    </div>
  );
}
