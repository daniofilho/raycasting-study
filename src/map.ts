//https://onlinetexttools.com/convert-text-to-nice-columns <= beautify this array - Right-align columns
// prettier-ignore
const map = [
  ['wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall'],
  ['wall','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['wall','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['wall','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['wall','floor','floor','floor','floor','floor','stone','stone','stone','stone','stone','floor','floor','floor','floor','wood','floor','wood','floor','wood','floor','floor','floor','wall'],
  ['wall','floor','floor','floor','floor','floor','stone','floor','floor','floor','stone','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['wall','floor','floor','floor','floor','floor','stone','floor','floor','floor','stone','floor','floor','floor','floor','wood','floor','floor','floor','wood','floor','floor','floor','wall'],
  ['wall','floor','floor','floor','floor','floor','stone','floor','floor','floor','stone','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['wall','floor','floor','floor','floor','floor','stone','stone','floor','stone','stone','floor','floor','floor','floor','wood','floor','wood','floor','wood','floor','floor','floor','wall'],
  ['wall','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['wall','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['wall','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['wall','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['wall','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['wall','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['wall','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['wall','jail','jail','jail','jail','jail','jail','jail','jail','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['wall','jail','floor','jail','floor','floor','floor','floor','jail','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['wall','jail','floor','floor','floor','floor','floor','floor','jail','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['wall','jail','floor','jail','floor','floor','floor','floor','jail','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['wall','jail','floor','jail','jail','jail','jail','jail','jail','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['wall','jail','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['wall','jail','jail','jail','jail','jail','jail','jail','jail','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall']
];

const mapWidth = map[0].length;
const mapHeight = map.length;

export { map, mapWidth, mapHeight };
