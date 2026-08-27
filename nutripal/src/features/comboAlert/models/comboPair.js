/**
 * @typedef {Object} ComboPairReaction
 * @property {string} my - Myanmar text
 * @property {string} en - English text
 */

/**
 * @typedef {Object} ComboPairReactions
 * @property {ComboPairReaction} badCorrect - Praise for correctly guessing "No" on a bad pair
 * @property {ComboPairReaction} badIncorrect - Explanation for incorrectly guessing "Yes" on a bad pair
 * @property {ComboPairReaction} goodCorrect - Celebration for correctly guessing "Yes" on a good pair
 * @property {ComboPairReaction} goodIncorrect - Encouragement for incorrectly guessing "No" on a good pair
 */

/**
 * @typedef {Object} ComboPair
 * @property {string} foodA - First food ID
 * @property {string} foodB - Second food ID
 * @property {"bad"|"good"} type - Whether this is a bad or good pairing
 * @property {ComboPairReactions} reactions - Bilingual reaction lines
 */

/**
 * Get the correct reaction for a combo pair based on the child's guess.
 * @param {ComboPair} pair
 * @param {boolean} childSaidYes - true if child tapped "Yes, I would!"
 * @returns {{ text: { my: string, en: string }, isCorrect: boolean }}
 */
export function getComboReaction(pair, childSaidYes) {
  const isBadPair = pair.type === 'bad';
  const isCorrect = isBadPair ? !childSaidYes : childSaidYes;

  if (isBadPair) {
    return {
      text: isCorrect ? pair.reactions.badCorrect : pair.reactions.badIncorrect,
      isCorrect,
    };
  }

  return {
    text: isCorrect ? pair.reactions.goodCorrect : pair.reactions.goodIncorrect,
    isCorrect,
  };
}
