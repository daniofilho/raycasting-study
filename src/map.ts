//https://onlinetexttools.com/convert-text-to-nice-columns <= beautify this array - Right-align columns
// prettier-ignore
const map = [
  ['stone','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall'],
  ['stone','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['stone','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['stone','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['stone','floor','floor','floor','floor','floor','stone','stone','stone','stone','stone','floor','floor','floor','floor','wood','floor','wood','floor','wood','floor','floor','floor','wall'],
  ['stone','floor','floor','floor','floor','floor','stone','floor','floor','floor','stone','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['stone','floor','floor','floor','floor','floor','stone','floor','floor','floor','stone','floor','floor','floor','floor','wood','floor','floor','floor','wood','floor','floor','floor','wall'],
  ['stone','floor','floor','floor','floor','floor','stone','floor','floor','floor','stone','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['stone','floor','floor','floor','floor','floor','stone','stone','floor','stone','stone','floor','floor','floor','floor','wood','floor','wood','floor','wood','floor','floor','floor','wall'],
  ['stone','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['stone','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['stone','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['stone','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['stone','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['stone','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['stone','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['stone','jail','jail','jail','jail','jail','jail','jail','jail','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['stone','jail','floor','jail','floor','floor','floor','floor','jail','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['stone','jail','floor','floor','floor','floor','floor','floor','jail','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['stone','jail','floor','jail','floor','floor','floor','floor','jail','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['stone','jail','floor','jail','jail','jail','jail','jail','jail','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['stone','jail','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['stone','jail','jail','jail','jail','jail','jail','jail','jail','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['stone','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall']
];

const mapWidth = map[0].length;
const mapHeight = map.length;

export { map, mapWidth, mapHeight };
