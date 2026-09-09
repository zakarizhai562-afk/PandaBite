// Panda speech-bubble lines migrated 1:1 from the Python reference
// (old/game/settings.py MESSAGE_TEXTS_*, TUTORIAL_HINT_TEXT).
export const MESSAGE_TEXTS_IDLE = [
  "Hi! I'm Panda! Drag each food into the right basket to help me grow big and strong!",
  "Let's sort some yummy food together!",
  'Which basket does this food belong in?',
  'I love eating healthy food every day!',
];

export const MESSAGE_TEXTS_HAPPY = [
  'Yay! You got it right!',
  "Great job! That's exactly right!",
  'Awesome sorting! Keep it up!',
  "You're a food-sorting star!",
];

export const MESSAGE_TEXTS_SAD = [
  "Oops! Let's try again!",
  'Not quite! Give it another try!',
  "That's okay, mistakes help us learn!",
  'Almost! Try a different basket next time!',
];

export const TUTORIAL_HINT_TEXT = 'Drag the food to the correct basket!';

export function pickMessage(messages, previous = null) {
  const choices = previous && messages.length > 1 ? messages.filter((m) => m !== previous) : messages;
  return choices[Math.floor(Math.random() * choices.length)];
}
