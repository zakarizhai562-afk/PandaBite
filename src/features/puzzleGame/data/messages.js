// Panda speech-bubble lines migrated 1:1 from the Python reference
// (old/game/settings.py MESSAGE_TEXTS_*, TUTORIAL_HINT_TEXT), extended with
// a Burmese line for each entry so the message box reads bilingually (English
// primary, Burmese secondary caption) -- same convention as the Daily
// Balance mascot bubble (.daily-log-bubble-my/-en).
export const MESSAGE_TEXTS_IDLE = [
  {
    en: "Hi! I'm Panda! Drag each food into the right basket to help me grow big and strong!",
    my: 'မင်္ဂလာပါ! ကျွန်တော် ပန်ဒါပါ! အစားအစာတွေကို မှန်ကန်တဲ့ တောင်းထဲ ဆွဲထည့်ပြီး ကျွန်တော့်ကို ကြီးထွားအားကောင်းအောင် ကူညီပါ!',
  },
  {
    en: "Let's sort some yummy food together!",
    my: 'စားလို့ကောင်းတဲ့ အစားအစာတွေကို အတူတူ ခွဲခြားကြည့်ရအောင်!',
  },
  {
    en: 'Which basket does this food belong in?',
    my: 'ဒီအစားအစာက ဘယ်တောင်းထဲ ကျရောက်မလဲ?',
  },
  {
    en: 'I love eating healthy food every day!',
    my: 'နေ့တိုင်း ကျန်းမာရေးနဲ့ ညီညွတ်တဲ့ အစားအစာစားရတာ ကျွန်တော် ကြိုက်ပါတယ်!',
  },
];

export const MESSAGE_TEXTS_HAPPY = [
  { en: 'Yay! You got it right!', my: 'ဟူးရေ! မှန်ကန်စွာ လုပ်နိုင်ပါတယ်!' },
  { en: "Great job! That's exactly right!", my: 'တော်လိုက်တာ! အတိအကျ မှန်ကန်ပါတယ်!' },
  { en: 'Awesome sorting! Keep it up!', my: 'အံ့သြစရာ ခွဲခြားနိုင်စွမ်း! ဆက်လုပ်ပါ!' },
  { en: 'Great food sorting!', my: 'အစားအစာခွဲခြားတာ တော်လိုက်တာ!' },
];

export const MESSAGE_TEXTS_SAD = [
  { en: "Oops! Let's try again!", my: 'အိုး! နောက်တစ်ခါ ထပ်ကြိုးစားကြည့်ရအောင်!' },
  { en: 'Not quite! Give it another try!', my: 'မမှန်သေးဘူး! နောက်တစ်ခါ ထပ်ကြိုးစားပါ!' },
  { en: "That's okay, mistakes help us learn!", my: 'ရပါတယ်၊ အမှားတွေက သင်ခန်းစာပေးတယ်!' },
  { en: 'Almost! Try a different basket next time!', my: 'နီးစပ်နေပြီ! နောက်တစ်ခါ တခြားတောင်းကို စမ်းကြည့်ပါ!' },
];

export const TUTORIAL_HINT_TEXT = {
  en: 'Drag the food to the correct basket!',
  my: 'အစားအစာကို မှန်ကန်တဲ့တောင်းထဲ ဆွဲထည့်ပါ!',
};

// `messages` entries are now {en, my} objects -- comparing by reference (===)
// still works fine for excluding the previous pick, same as when these were
// plain strings.
export function pickMessage(messages, previous = null) {
  const choices = previous && messages.length > 1 ? messages.filter((m) => m !== previous) : messages;
  return choices[Math.floor(Math.random() * choices.length)];
}
