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
        <img
          src="/panda/panda_encouraging.png"
          alt="Red Panda"
          width="56"
          height="56"
          style={{ borderRadius: '50%' }}
        />
      </div>
      <div className="mascot-speech">
        {displayText.my && <p className="mascot-text-my">{displayText.my}</p>}
        <p className="mascot-text-en">{displayText.en}</p>
      </div>
    </div>
  );
}
