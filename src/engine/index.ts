// tslint:disable-next-line
const Stats = require('stats.js'); // This "require" is necessary for Stats JS to work with Typescript

import Screen from './Screen';
import MiniMap from './MiniMap';
import Player from './Player';
import Textures from './Textures';

import Scenario from './Scenario';

import * as config from '../config/config';

const Game = () => {
  // FPS Status
  const FPSstats = new Stats();
  FPSstats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(FPSstats.dom);

  // Game Objects
  const textures = Textures();

  const screen = new Screen(config.screen);

  const minimap = new MiniMap(config.miniMapAllRays);
  const minimap_singleRay = new MiniMap(config.miniMapSingleRay);

  const configScenario = config.scenario;

  const player = Player(minimap, minimap_singleRay, screen, textures, configScenario);

  const scenario = Scenario(player, minimap, minimap_singleRay, screen, configScenario, textures);

  // FPS Control
  let fpsInterval = 0;
  let now = 0;
  let deltaTime = 0;
  let elapsed = 0;

  // Events
  let keysDown = [];

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
    scenario.render();
    player.render(keysDown);
    player.postRender();
  };

  // # "Thread" tha runs the game
  const runGame = (fps: number) => {
    fpsInterval = 1000 / fps;
    deltaTime = Date.now();
    gameLoop();
  };

  const gameLoop = () => {
    FPSstats.begin();

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
    FPSstats.end();

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
