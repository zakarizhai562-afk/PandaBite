// Basket definitions migrated 1:1 from the Python reference (old/game/basket.py
// create_baskets() + GROUP_COLORS). Names, short labels, and theme colors are
// exactly as authored there.
const IMAGE_BASE = '/puzzle-classic/images';

export const BASKETS = [
  {
    id: 'energy',
    group: 'energy',
    name: 'Energy-Giving Foods',
    shortLabel: 'Energy',
    subtitle: 'Energy-Giving',
    image: `${IMAGE_BASE}/energy_basket.png`,
    themeColor: '#F0963C', // Python ORANGE (240, 150, 60)
  },
  {
    id: 'body',
    group: 'body',
    name: 'Body-Building Foods',
    shortLabel: 'Body',
    subtitle: 'Body-Building',
    image: `${IMAGE_BASE}/body_basket.png`,
    themeColor: '#F078A0', // Python PINK (240, 120, 160)
  },
  {
    id: 'protective',
    group: 'protective',
    name: 'Protective Foods',
    shortLabel: 'Protective',
    subtitle: 'Protective',
    image: `${IMAGE_BASE}/protective_basket.png`,
    themeColor: '#50B464', // Python GREEN (80, 180, 100)
  },
];

export function getBasketByGroup(group) {
  return BASKETS.find((b) => b.group === group) || null;
}

export function getBasketById(id) {
  return BASKETS.find((b) => b.id === id) || null;
}
