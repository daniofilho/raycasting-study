import Engine from './engine';

// Debug global variables
declare global {
  interface Window {
    global: any;
  }
}
window.global = {
  renderTextures: true,
};

// Start the engine
const engine = Engine();

engine.startGame();
