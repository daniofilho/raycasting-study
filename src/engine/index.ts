import Canvas from './Canvas';
import Screen from './Screen';
import MiniMap from './MiniMap';
import Player from './Player';

import Scenario from './Scenario';

import * as config from '../config';

const Game = () => {
  // constructor
  const screenCanvas = Canvas(config.screen);
  const screen = Screen(screenCanvas);

  const minimapCanvas = Canvas(config.miniMap);
  const minimap = MiniMap(minimapCanvas, config.miniMap);

  const player = Player(minimapCanvas);

  const scenario = Scenario(player, minimapCanvas, screenCanvas, config.scenario);

  // FPS Control
  let fpsInterval = 0;
  let now = 0;
  let deltaTime = 0;
  let elapsed = 0;

  // Events
  let keysDown = {};

  // Game
  let gameReady = false;

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

  // # Default Event Listeners
  const defaultEventListeners = () => {
    // # Keyboard Events
    window.addEventListener(
      'keydown',
      function (e: KeyboardEvent) {
        keysDown[e.keyCode] = true;
      }.bind(this),
      false
    );

    window.addEventListener(
      'keyup',
      function (e: KeyboardEvent) {
        // Clear previous keys
        delete keysDown[e.keyCode];
      }.bind(this),
      false
    );
  };

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

  // # Start a Game
  const startGame = () => {
    defaultEventListeners();

    // Ok, run the game now
    gameReady = true;
    runGame(config.game.fps);
  }; //newGame

  // # The Game Loop
  const updateGame = () => {
    // # What to update every frame?
    scenario.render(keysDown);
  };

  // # "Thread" tha runs the game
  const runGame = (fps: number) => {
    fpsInterval = 1000 / fps;
    deltaTime = Date.now();
    gameLoop();
  };

  const gameLoop = () => {
    // calc elapsed time since last loop
    now = Date.now();
    elapsed = now - deltaTime;

    // if enough time has elapsed, draw the next frame
    if (elapsed > fpsInterval) {
      // Get ready for next frame by setting then=now, but also adjust for your
      // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
      deltaTime = now - (elapsed % fpsInterval);

      updateGame();
    }

    // Runs only when the browser is in focus
    // Request another frame
    requestAnimationFrame(gameLoop.bind(this));
  };

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

  // Return all public functions
  return {
    startGame,
  };
};
export default Game;
