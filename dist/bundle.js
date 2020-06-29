(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.player = exports.miniMap = exports.screen = exports.scenario = exports.game = void 0;
exports.game = {
    fps: 60,
    depthfOfField: 8,
};
exports.scenario = {
    tileSize: 32,
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
    relativeWidth: 800,
    relativeHeight: 800,
    x: exports.screen.width - 100,
    y: exports.screen.height - 100,
};
exports.player = {
    x: exports.miniMap.width / 2,
    y: exports.miniMap.height / 2,
    width: exports.scenario.tileSize / 2.5,
    height: exports.scenario.tileSize / 2.5,
    color: '#FFFF00',
    speed: 0.3,
    fieldOfView: 60,
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
        drawRectangle({ x: 0, y: 0, width, height, color: backgroundColor });
    };
    const drawText = ({ text, x, y, color = '#000', size = 20, align = 'left' }) => {
        context.font = `${size}px Arial`;
        context.fillStyle = color;
        context.textAlign = align;
        context.fillText(text, x, y);
    };
    const drawRectangle = ({ x, y, width, height, color }) => {
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
    };
    const drawLine = ({ x, y, toX, toY, color }) => {
        context.strokeStyle = color;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(toX, toY);
        context.stroke();
    };
    const drawElipse = ({ x, y, radius, color = '#FFF' }) => {
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
        drawText,
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
        angle: Math.PI / 2,
        fieldOfView: config.player.fieldOfView,
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
        //props.canvas.drawRectangle({ x, y, width, height, color });
        props.canvas.drawElipse({ x, y, radius: width, color });
        // player eye direction
        props.canvas.drawLine({
            x,
            y,
            toX: x + deltaX * 5,
            toY: y + deltaY * 5,
            color: '#FF0000',
        });
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
const config = require("../../../config");
// Math PI relative variables - pure matemagician here
const PI2 = Math.PI / 2;
const PI3 = (3 * Math.PI) / 2;
const DR = 0.0174533; // one degree in radians
const RayCasting = (scenario, player, canvasMinimap, canvasScreen) => {
    const { tiles, tilesX, tilesY, tileSize } = scenario;
    const props = {
        rays: player.get('fieldOfView'),
        dof: config.game.depthfOfField,
        fov: player.get('fieldOfView'),
    };
    const raysQuantity = tilesX * tileSize;
    // Ray
    let rayX, rayY;
    let rayXoffset, rayYoffset;
    // Position of ray on map
    let mapX, mapY, mapPosition;
    const normalizeAngle = (angle) => {
        angle = angle % (2 * Math.PI);
        if (angle < 0) {
            angle = 2 * Math.PI + angle;
        }
        return angle;
    };
    // # Determine the distance between player and "ray hit" point
    const calcDistance = ({ object, target }) => {
        return Math.sqrt((target.x - object.x) * (target.x - object.x) + (target.y - object.y) * (target.y - object.y));
    };
    // # Render Casted ray
    const renderRay = ({ rayX, rayY }) => {
        // ## Mini map 2D rendering
        // starting from where the player is to where it ends
        const playerX = player.get('x');
        const playerY = player.get('y');
        canvasMinimap.drawLine({
            x: playerX,
            y: playerY,
            toX: rayX,
            toY: rayY,
            color: '#00FFFF',
        });
    };
    // # Ray Casting on horizontal lines
    const castHorizontalRays = ({ rayAngle, playerX, playerY, isRayFacingDown, isRayFacingUp, isRayFacingRight, isRayFacingLeft, }) => {
        let currentDOF = 0;
        let horizontalDistance = 1000000; //we need to check the lowest value, so let's make it high
        let horizontalX = playerX;
        let horizontalY = playerY;
        // Find the y-coordinate of the closest horizontal grid intersenction
        const interceptionY = Math.floor(playerY / tileSize) * tileSize;
        rayY = interceptionY;
        rayY += isRayFacingDown ? tileSize : 0;
        const adjacent = (rayY - playerY) / Math.tan(rayAngle);
        rayX = playerX + adjacent;
        // Now we need X and Y offset
        rayYoffset = tileSize;
        if (isRayFacingUp)
            rayYoffset *= -1; // negative or positive according to angle direction
        rayXoffset = tileSize / Math.tan(rayAngle);
        rayXoffset *= isRayFacingLeft && rayXoffset > 0 ? -1 : 1;
        rayXoffset *= isRayFacingRight && rayXoffset < 0 ? -1 : 1;
        // ## ray os looking straight? left or right
        // in this situation it's impossible for ray hit a horizontal line
        if (rayAngle === 0 || rayAngle === Math.PI) {
            rayX = playerX;
            rayY = playerY;
            currentDOF = props.dof; // so end loop
        }
        // If facing up, need to add tile size so rayY will be right
        if (isRayFacingUp)
            rayY--;
        // ## We don't wanna check forever, so we add a depth of field limit
        while (currentDOF < props.dof) {
            // determine position of ray on map
            mapX = Math.floor(rayX / tileSize);
            mapY = Math.floor(rayY / tileSize);
            mapPosition = mapY * tilesX + mapX; // tilesX = how many tiles have on x-coordinate
            // Check if ray hits a wall or scenario bounds
            if (mapPosition > 0 && // inside screen
                mapPosition < tilesX * tilesY && // not out screen
                tiles[mapPosition] === 1 // hit wall
            ) {
                // Save values to check lowest later
                horizontalX = rayX;
                horizontalY = rayY;
                horizontalDistance = calcDistance({
                    object: { x: playerX, y: playerY },
                    target: { x: horizontalX, y: horizontalY },
                });
                currentDOF = props.dof; // end loop
            }
            else {
                // to check next line, just add the offset value
                // # this is the key optimization of this algorithm
                rayX += rayXoffset;
                rayY += rayYoffset;
                currentDOF++;
            }
        }
        return {
            horizontalX,
            horizontalY,
            horizontalDistance,
        };
    };
    // # Ray Casting on vertical lines
    const castVerticalRays = ({ rayAngle, playerX, playerY, isRayFacingDown, isRayFacingUp, isRayFacingRight, isRayFacingLeft, }) => {
        let currentDOF = 0;
        let verticalDistance = 1000000; //we need to check the lowest value, so let's make it high
        let verticalX = playerX;
        let verticalY = playerY;
        // Find the y-coordinate of the closest horizontal grid intersenction
        const interceptionX = Math.floor(playerX / tileSize) * tileSize;
        rayX = interceptionX;
        rayX += isRayFacingRight ? tileSize : 0;
        const adjacent = (rayX - playerX) * Math.tan(rayAngle);
        rayY = playerY + adjacent;
        // Now we need X and Y offset
        rayXoffset = tileSize;
        if (isRayFacingLeft)
            rayXoffset *= -1; // negative or positive according to angle direction
        rayYoffset = tileSize * Math.tan(rayAngle);
        rayYoffset *= isRayFacingUp && rayYoffset > 0 ? -1 : 1;
        rayYoffset *= isRayFacingDown && rayYoffset < 0 ? -1 : 1;
        // ## ray os looking straight? left or right
        // in this situation it's impossible for ray hit a horizontal line
        if (rayAngle === 0 || rayAngle === Math.PI) {
            rayX = playerX;
            rayY = playerY;
            currentDOF = props.dof; // so end loop
        }
        // If facing left, need to add tile size so rayX will be right
        if (isRayFacingLeft)
            rayX--;
        while (currentDOF < props.dof) {
            // determine position of ray on map
            mapX = Math.floor(rayX / tileSize);
            mapY = Math.floor(rayY / tileSize);
            mapPosition = mapY * tilesX + mapX; // tilesX = how many tiles have on x-coordinate
            // Check if ray hits a wall or scenario bounds
            if (mapPosition > 0 && // inside screen
                mapPosition < tilesX * tilesY && // not out screen
                tiles[mapPosition] === 1 // hit wall
            ) {
                // Save values to check lowest later
                verticalX = rayX;
                verticalY = rayY;
                verticalDistance = calcDistance({
                    object: { x: playerX, y: playerY },
                    target: { x: verticalX, y: verticalY },
                });
                currentDOF = props.dof; // end loop
            }
            else {
                // to check next line, just add the offset value
                // # this is the key optimization of this algorithm
                rayX += rayXoffset;
                rayY += rayYoffset;
                currentDOF++;
            }
        }
        return {
            verticalX,
            verticalY,
            verticalDistance,
        };
    };
    const render = () => {
        // Determine the ray angle of casting acording to player field of view
        let rayAngle = player.get('angle') - DR * (props.fov / 2);
        if (rayAngle < 0) {
            rayAngle += 2 * Math.PI;
        }
        if (rayAngle > 2 * Math.PI) {
            rayAngle -= 2 * Math.PI;
        }
        rayAngle = normalizeAngle(rayAngle);
        const playerY = Math.floor(player.get('y'));
        const playerX = Math.floor(player.get('x'));
        const isRayFacingDown = rayAngle < Math.PI;
        const isRayFacingUp = !isRayFacingDown;
        const isRayFacingRight = rayAngle < PI2 || rayAngle > PI3;
        const isRayFacingLeft = !isRayFacingRight;
        // cast the rays  - substitute of FOR for performance reasons
        for (let i = 0; i < props.fov; i++) {
            const HorRays = castHorizontalRays({
                rayAngle,
                playerX,
                playerY,
                isRayFacingDown,
                isRayFacingUp,
                isRayFacingRight,
                isRayFacingLeft,
            });
            const VertRays = castVerticalRays({
                rayAngle,
                playerX,
                playerY,
                isRayFacingDown,
                isRayFacingUp,
                isRayFacingRight,
                isRayFacingLeft,
            });
            // Which function gave the lowest value (lowest distance)?
            let rayX, rayY;
            if (VertRays.verticalDistance < HorRays.horizontalDistance) {
                rayX = VertRays.verticalX;
                rayY = VertRays.verticalY;
            }
            if (HorRays.horizontalDistance < VertRays.verticalDistance) {
                rayX = HorRays.horizontalX;
                rayY = HorRays.horizontalY;
            }
            //const distance
            // # Now render the slowest value
            // 2D ray
            renderRay({ rayX, rayY });
            // 3D wall - This is where we wanted to go
            //render3DRay()
            canvasScreen.drawText({
                x: 0,
                y: i * 25 + 25,
                text: `rayAngle: ${rayAngle}`,
            });
            // Increase angle for next ray
            rayAngle += DR;
            if (rayAngle < 0) {
                rayAngle += 2 * Math.PI;
            }
            if (rayAngle > 2 * Math.PI) {
                rayAngle -= 2 * Math.PI;
            }
        }
    };
    return {
        render,
    };
};
exports.default = RayCasting;

},{"../../../config":1}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RayCasting_1 = require("./RayCasting");
const Scenario = (player, canvasMiniMap, canvasScreen, config) => {
    const { tileSize, tilesX, tilesY, tiles, wallColor, floorColor } = config;
    const rayCasting = RayCasting_1.default(config, player, canvasMiniMap, canvasScreen);
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
                canvasMiniMap.drawRectangle({
                    x: x0,
                    y: y0,
                    width: tileSize - 1,
                    height: tileSize - 1,
                    color: tileColor,
                });
            });
        });
    };
    // Ray Casting
    const renderRays = () => {
        rayCasting.render();
    };
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
engine.startGame();

},{"./engine":8}]},{},[9]);
