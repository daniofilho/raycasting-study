(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.player = exports.miniMap = exports.screen = exports.scenario = exports.game = void 0;
exports.game = {
    fps: 60,
};
exports.scenario = {
    tileSize: 50,
    tilesX: 9,
    tilesY: 9,
    // prettier-ignore
    tiles: [
        1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 0, 1, 0, 0, 0, 0, 0, 1,
        1, 0, 1, 0, 0, 1, 1, 0, 1,
        1, 0, 1, 0, 0, 0, 1, 0, 1,
        1, 0, 0, 0, 0, 0, 1, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 1, 1, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1,
    ],
    wallColor: '#008800',
    floorColor: 'rgba(0,0,0,0.5)',
};
exports.screen = {
    canvasID: 'screen',
    backgroundColor: '#333333',
    width: 800,
    height: 600,
};
exports.miniMap = {
    canvasID: 'minimap',
    backgroundColor: '#000',
    opacity: 0.5,
    width: exports.scenario.tilesX * exports.scenario.tileSize,
    height: exports.scenario.tilesY * exports.scenario.tileSize,
    relativeHeight: 500,
    relativeWidth: 500,
    x: exports.screen.width - 100,
    y: exports.screen.height - 100,
};
exports.player = {
    x: exports.miniMap.width / 2,
    y: exports.miniMap.height / 2,
    width: exports.scenario.tileSize / 2,
    height: exports.scenario.tileSize / 2,
    color: '#FFFF00',
    speed: 0.3,
};

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Canvas = (config) => {
    // Constructor
    const canvas = document.getElementById(config.canvasID);
    const context = canvas.getContext('2d');
    // Canvas Size
    const { width, height } = config;
    canvas.width = width;
    canvas.height = height;
    // Get some prop
    const get = (prop) => {
        return canvas[prop];
    };
    const getConfig = () => {
        return config;
    };
    const getContext = () => {
        return context;
    };
    const getCanvasDOM = () => {
        return canvas;
    };
    // Reset canvas
    const reset = () => {
        const { width, height, backgroundColor } = config;
        // Background
        drawRectangle(0, 0, width, height, backgroundColor);
    };
    // Draw a rectangle on canvas
    const drawRectangle = (x, y, width, height, color) => {
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
    };
    // Draw a line on canvas
    const drawLine = (x, y, toX, toY, color) => {
        context.strokeStyle = color;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(toX, toY);
        context.stroke();
    };
    // Draw a circle on canvas
    const drawElipse = (x, y, radius, color) => {
        context.strokeStyle = color;
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.stroke();
    };
    // Return all public functions
    return {
        reset,
        get,
        getConfig,
        getContext,
        getCanvasDOM,
        drawRectangle,
        drawLine,
        drawElipse,
    };
};
exports.default = Canvas;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MiniMap = (canvas, config) => {
    // Canvas relative size
    canvas.getCanvasDOM().style.width = config.relativeWidth + 'px';
    canvas.getCanvasDOM().style.height = config.relativeHeight + 'px';
    canvas.getCanvasDOM().style.opacity = config.opacity.toString();
    // Get some prop
    const get = (prop) => {
        return canvas.get(prop);
    };
    // Render
    const render = () => {
        canvas.reset();
    };
    // Return all public functions
    return {
        get,
        render,
    };
};
exports.default = MiniMap;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("../../config");
const Player = (canvas) => {
    // Constructor
    const props = {
        canvas,
        x: config.player.x,
        y: config.player.y,
        deltaX: Math.cos(2 * Math.PI) * 5,
        deltaY: Math.sin(2 * Math.PI) * 5,
        angle: 0,
    };
    // Middlwares for setting props
    const setX = (x) => {
        props.x = x;
    };
    const setY = (y) => {
        props.y = y;
    };
    const setAngle = (angle) => {
        props.angle = angle;
    };
    const setDeltaX = (x) => {
        props.deltaX = x;
    };
    const setDeltaY = (y) => {
        props.deltaY = y;
    };
    const get = (prop) => {
        return props[prop];
    };
    // Player movements
    const goFront = () => {
        const { x, y, deltaX, deltaY } = props;
        setX(x + config.player.speed * deltaX);
        setY(y + config.player.speed * deltaY);
    };
    const goBack = () => {
        const { x, y, deltaX, deltaY } = props;
        setX(x - config.player.speed * deltaX);
        setY(y - config.player.speed * deltaY);
    };
    const turnLeft = () => {
        const { angle } = props;
        // Define angle
        let newAngle = angle - 0.05;
        if (newAngle < 0)
            newAngle = angle + 2 * Math.PI;
        setAngle(newAngle);
        // Deltas
        setDeltaX(Math.cos(newAngle) * 5);
        setDeltaY(Math.sin(newAngle) * 5);
    };
    const turnRight = () => {
        const { angle } = props;
        // Define angle
        let newAngle = angle + 0.05;
        if (newAngle > 2 * Math.PI)
            newAngle = angle - 2 * Math.PI;
        setAngle(newAngle);
        // Deltas
        setDeltaX(Math.cos(newAngle) * 5);
        setDeltaY(Math.sin(newAngle) * 5);
    };
    // Actions on key press
    const handleKeyUp = (keyCodes) => {
        if (keyCodes[39])
            turnRight();
        if (keyCodes[37])
            turnLeft();
        if (keyCodes[40])
            goBack();
        if (keyCodes[38])
            goFront();
        // @TODO strafe left and right
    };
    // Render the player
    const render = (keyCodes) => {
        const { x, y, deltaX, deltaY } = props;
        const { width, height, color } = config.player;
        handleKeyUp(keyCodes);
        // player body
        //props.canvas.drawRectangle(x, y, width, height, color);
        props.canvas.drawElipse(x, y, width, color);
        // player eye direction
        props.canvas.drawLine(x, y, x + deltaX * 5, y + deltaY * 5, '#FF0000');
    };
    // Return all public functions
    return {
        render,
        get,
    };
};
exports.default = Player;

},{"../../config":1}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ray = () => {
    const ray = 0;
    const mx = 0;
    const my = 0;
    const mp = 0;
    const dof = 90; // depth of field
    const rayX = 0;
    const rayY = 0;
    const ra = 0;
    const xOffset = 0;
    const yOffset = 0;
    return {};
};
exports.default = Ray;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RayCasting_1 = require("./RayCasting");
const Scenario = (player, canvasMiniMap, canvasScreen, config) => {
    const { tileSize, tilesX, tilesY, tiles, wallColor, floorColor } = config;
    const rayCasting = RayCasting_1.default();
    // Tiles
    const renderTiles = () => {
        // Loop tiles
        new Array(tilesX).fill('').forEach((_, x) => {
            new Array(tilesY).fill('').forEach((_, y) => {
                const x0 = x * tileSize;
                const y0 = y * tileSize;
                // Define tile color based on tile value (0,1)
                const tileColor = tiles[y * tilesX + x] === 1 ? wallColor : floorColor;
                // Minimap
                canvasMiniMap.drawRectangle(x0, y0, tileSize - 1, tileSize - 1, tileColor);
            });
        });
    };
    // Ray Casting
    const renderRays = () => { };
    // Render
    const render = (keysDown) => {
        canvasScreen.reset();
        canvasMiniMap.reset();
        renderTiles();
        renderRays();
        player.render(keysDown);
    };
    // Return all public functions
    return {
        render,
    };
};
exports.default = Scenario;

},{"./RayCasting":5}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Screen = (canvas) => {
    // Get some prop
    const get = (prop) => {
        return canvas.get(prop);
    };
    // Render
    const render = () => {
        canvas.reset();
    };
    // Return all public functions
    return {
        get,
        render,
    };
};
exports.default = Screen;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Canvas_1 = require("./Canvas");
const Screen_1 = require("./Screen");
const MiniMap_1 = require("./MiniMap");
const Player_1 = require("./Player");
const Scenario_1 = require("./Scenario");
const config = require("../config");
const Game = () => {
    // constructor
    const screenCanvas = Canvas_1.default(config.screen);
    const screen = Screen_1.default(screenCanvas);
    const minimapCanvas = Canvas_1.default(config.miniMap);
    const minimap = MiniMap_1.default(minimapCanvas, config.miniMap);
    const player = Player_1.default(minimapCanvas);
    const scenario = Scenario_1.default(player, minimapCanvas, screenCanvas, config.scenario);
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
        window.addEventListener('keydown', function (e) {
            keysDown[e.keyCode] = true;
        }.bind(this), false);
        window.addEventListener('keyup', function (e) {
            // Clear previous keys
            delete keysDown[e.keyCode];
        }.bind(this), false);
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
    const runGame = (fps) => {
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
exports.default = Game;

},{"../config":1,"./Canvas":2,"./MiniMap":3,"./Player":4,"./Scenario":6,"./Screen":7}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = require("./engine");
const engine = engine_1.default();
console.clear();
engine.startGame();

},{"./engine":8}]},{},[9]);
