// prettier-ignore
const tiles = [
  ['stone','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall'],                       
  ['stone','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'], 
  ['stone','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'], 
  ['stone','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','lamp','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],  
  ['stone','floor','floor','floor','floor','floor','stone','stone','stone','stone','stone','floor','floor','floor','floor','wood','floor','wood','floor','wood','floor','floor','floor','wall'],    
  ['stone','floor','floor','floor','floor','floor','stone','floor','floor','floor','stone','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'], 
  ['stone','floor','floor','floor','floor','floor','stone','floor','floor','floor','stone','floor','floor','floor','floor','wood','floor','floor','floor','wood','floor','floor','floor','wall'],   
  ['stone','floor','floor','floor','floor','floor','stone','floor','floor','floor','stone','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'], 
  ['stone','floor','floor','floor','floor','floor','stone','stone','floor','stone','stone','pillar','floor','floor','floor','wood','floor','wood','floor','wood','floor','floor','floor','wall'],    
  ['stone','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'], 
  ['stone','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'], 
  ['stone','floor','table','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'], 
  ['stone','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'], 
  ['stone','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
  ['stone','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'], 
  ['stone','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'], 
  ['stone','jail','jail','jail','jail','jail','jail','jail','jail','pillar','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],         
  ['stone','jail','floor','jail','floor','floor','floor','floor','jail','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],    
  ['stone','jail','floor','floor','floor','floor','floor','floor','jail','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],   
  ['stone','jail','floor','jail','floor','floor','floor','floor','jail','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],    
  ['stone','jail','floor','jail','jail','jail','jail','jail','jail','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],        
  ['stone','jail','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],  
  ['stone','jail','jail','jail','jail','jail','jail','jail','jail','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','floor','wall'],         
  ['stone','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall']                        
];

const map = {
  tiles,
  width: tiles[0].length,
  height: tiles.length,
};
const player = {
  x: 18.5,
  y: 16,
  pod: 270,
};

export { map, player };
