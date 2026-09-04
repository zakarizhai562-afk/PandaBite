export function getGrowthStage(stars) {
  const total = typeof stars === 'number' && !Number.isNaN(stars) ? stars : 0;
  if (total >= 150) return 3;
  if (total >= 50) return 2;
  return 1;
}

export function getGrowthStageLabel(stage) {
  if (stage === 3) return { en: 'Full Tail', my: 'အမြီးပြည့်ဝ' };
  if (stage === 2) return { en: 'Fuller Tail', my: 'အမြီးပိုပြည့်' };
  return { en: 'Bud Tail', my: 'အမြီးစ' };
}
