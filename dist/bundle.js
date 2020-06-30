(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Canvas_1 = require("../../engine/Canvas");
class MiniMap extends Canvas_1.default {
    constructor(config) {
        super(config);
        // Render
        this.render = () => {
            this.reset();
        };
        // Canvas relative size
        this.canvas.style.width = config.relativeWidth + 'px';
        this.canvas.style.height = config.relativeHeight + 'px';
        this.canvas.style.opacity = config.opacity.toString();
    }
}
exports.default = MiniMap;

},{"../../engine/Canvas":5}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("../../config");
const Player = (minimap, debugmap, screen) => {
    // Constructor
    const props = {
        minimap,
        debugmap,
        screen,
        width: config.player.width,
        height: config.player.height,
        x: config.player.x,
        y: config.player.y,
        deltaX: Math.cos(2 * Math.PI) * 5,
        deltaY: Math.sin(2 * Math.PI) * 5,
        angle: 0,
        turnSpeed: config.player.turnSpeed,
        speed: config.player.speed,
        fieldOfView: config.player.fieldOfView,
    };
    const tiles = config.scenario.tiles;
    const tileSize = config.scenario.tileSize;
    const scenarioWidth = config.scenario.tilesX * tileSize;
    const scenarioHeight = config.scenario.tilesY * tileSize;
    const isPlayerCollidingWall = (x, y) => {
        // # Simple Check, based on tile number
        // Check Tile on position
        const mapX = Math.floor(x / tileSize);
        const mapY = Math.floor(y / tileSize);
        const mapPosition = mapY * config.scenario.tilesX + mapX;
        return tiles[mapPosition] !== 0;
    };
    // Middlwares for setting props
    const setX = (x) => {
        let newX = x;
        // limit player
        if (newX > scenarioWidth)
            newX = scenarioWidth;
        if (newX < 0)
            newX = 0;
        // Check collision before set
        const isColliding = isPlayerCollidingWall(newX, props.y);
        if (!isColliding)
            props.x = newX;
    };
    const setY = (y) => {
        let newY = y;
        // limit player
        if (newY > scenarioHeight)
            newY = scenarioHeight;
        if (newY < 0)
            newY = 0;
        // Check collision before set
        const isColliding = isPlayerCollidingWall(props.x, newY);
        if (!isColliding)
            props.y = newY;
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
        const { x, y, deltaX, deltaY, speed } = props;
        setX(x + speed * deltaX);
        setY(y + speed * deltaY);
    };
    const goBack = () => {
        const { x, y, deltaX, deltaY, speed } = props;
        setX(x - speed * deltaX);
        setY(y - speed * deltaY);
    };
    const turnLeft = () => {
        const { angle, turnSpeed } = props;
        // Define angle
        let newAngle = angle - turnSpeed;
        if (newAngle < 0)
            newAngle = angle + 2 * Math.PI; // invert
        setAngle(newAngle);
        // Deltas
        setDeltaX(Math.cos(newAngle) * 5);
        setDeltaY(Math.sin(newAngle) * 5);
    };
    const turnRight = () => {
        const { angle, turnSpeed } = props;
        // Define angle
        let newAngle = angle + turnSpeed;
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
        props.minimap.drawElipse({ x, y, radius: width, color });
        props.debugmap.drawElipse({ x, y, radius: width, color });
        // player eye direction
        props.minimap.drawLine({
            x,
            y,
            toX: x + deltaX * 5,
            toY: y + deltaY * 5,
            color: '#FF0000',
        });
        props.debugmap.drawLine({
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

},{"../../config":4}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Canvas_1 = require("../../engine/Canvas");
class Screen extends Canvas_1.default {
    constructor(config) {
        super(config);
        // Render
        this.render = () => {
            this.reset();
        };
    }
}
exports.default = Screen;

},{"../../engine/Canvas":5}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.player = exports.miniMapAllRays = exports.miniMapSingleRay = exports.screen = exports.scenario = exports.game = void 0;
exports.game = {
    fps: 60,
    depthfOfField: 50,
    render: {
        light: 40,
    },
};
exports.scenario = {
    tileSize: 32,
    tilesX: 15,
    tilesY: 19,
    // prettier-ignore
    tiles: [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
        1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
        1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1,
        1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1,
        1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
        1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1,
        1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1,
        1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1,
        1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1,
        1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
        1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    ],
    minimap: {
        wall: { color: '#008800' },
        floor: { color: 'rgba(0,0,0,0.5)' },
    },
    screen: {
        sky: {
            color: { r: 80, g: 156, b: 200 },
        },
        floor: {
            color: { r: 70, g: 70, b: 70 },
        },
    },
};
exports.screen = {
    canvasID: 'screen',
    backgroundColor: '#333333',
    width: 800,
    height: 600,
};
exports.miniMapSingleRay = {
    canvasID: 'minimap_singleRay',
    backgroundColor: '#000',
    opacity: 1,
    width: exports.scenario.tilesX * exports.scenario.tileSize,
    height: exports.scenario.tilesY * exports.scenario.tileSize,
    relativeWidth: 250,
    relativeHeight: 250,
    x: exports.screen.width - 100,
    y: exports.screen.height - 100,
};
exports.miniMapAllRays = {
    canvasID: 'minimap_allRays',
    backgroundColor: '#000',
    opacity: 1,
    width: exports.scenario.tilesX * exports.scenario.tileSize,
    height: exports.scenario.tilesY * exports.scenario.tileSize,
    relativeWidth: 250,
    relativeHeight: 250,
    x: exports.screen.width - 100,
    y: exports.screen.height - 100,
};
exports.player = {
    x: exports.miniMapAllRays.width / 2,
    y: exports.miniMapAllRays.height / 2,
    width: exports.scenario.tileSize / 2.5,
    height: exports.scenario.tileSize / 2.5,
    color: '#FFFF00',
    speed: 0.3,
    turnSpeed: 0.03,
    fieldOfView: 60,
};

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Canvas {
    constructor(config) {
        // Get some prop
        this.get = (prop) => {
            return this.canvas[prop];
        };
        this.getConfig = () => {
            return this.config;
        };
        this.getContext = () => {
            return this.context;
        };
        // Reset canvas
        this.reset = () => {
            const { width, height, backgroundColor } = this.config;
            // Background
            this.drawRectangle({ x: 0, y: 0, width, height, color: backgroundColor });
        };
        // Create a Line Gradient
        this.createLineGradient = (color1, color2) => {
            const grd = this.context.createLinearGradient(0, 0, 0, 600);
            grd.addColorStop(0, color1);
            grd.addColorStop(1, color2);
            return grd;
        };
        // Create a texture pattern
        this.createPattern = (elementID) => {
            const img = document.getElementById(elementID);
            return this.context.createPattern(img, 'no-repeat');
        };
        // Draw a text
        this.drawText = ({ text, x, y, color = '#000', size = 20, align = 'left' }) => {
            const { context } = this;
            context.font = `${size}px Arial`;
            context.fillStyle = color;
            context.textAlign = align;
            context.fillText(text, x, y);
        };
        // Draw a rectangle on canvas
        this.drawRectangle = ({ x, y, width, height, color }) => {
            const { context } = this;
            context.fillStyle = color;
            context.fillRect(x, y, width, height);
        };
        // Draw a line on canvas
        this.drawLine = ({ x, y, toX, toY, color }) => {
            const { context } = this;
            context.strokeStyle = color;
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(toX, toY);
            context.stroke();
        };
        // Draw a circle on canvas
        this.drawElipse = ({ x, y, radius, color = '#FFF' }) => {
            const { context } = this;
            context.strokeStyle = color;
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI);
            context.stroke();
        };
        this.canvas = document.getElementById(config.canvasID);
        this.context = this.canvas.getContext('2d');
        this.config = config;
        // Canvas Size
        const { width, height } = config;
        this.canvas.width = width;
        this.canvas.height = height;
    }
}
exports.default = Canvas;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("../../../config");
// Math PI relative variables - pure matemagician here
const PI2 = Math.PI / 2;
const PI3 = (3 * Math.PI) / 2;
const RayCasting = (scenario, player, canvasMinimap, canvasMiniMapDebug, canvasScreen) => {
    const { tiles, tilesX, tilesY, tileSize } = scenario;
    const props = {
        rays: player.get('fieldOfView'),
        dof: config.game.depthfOfField,
        fov: player.get('fieldOfView'),
    };
    const raysQuantity = tilesX * tileSize;
    const fovAngle = props.fov * (Math.PI / 180);
    // Ray
    let rayX, rayY;
    let rayXoffset, rayYoffset;
    // Position of ray on map
    let mapX, mapY, mapPosition;
    const normalizeAngle = (angle) => {
        //return angle;
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
    // # Draw a debug Ray
    const debugSingleRay = ({ toX, toY, color }) => {
        const playerX = player.get('x');
        const playerY = player.get('y');
        canvasMiniMapDebug.drawLine({
            x: playerX,
            y: playerY,
            toX: toX,
            toY: toY,
            color,
        });
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
    // # Render Sky
    const renderSky = (wallX, wallY, wallWidth) => {
        const { r: skyR, g: skyG, b: skyB } = scenario.screen.sky.color;
        const skyColor = `rgb(${skyR}, ${skyG}, ${skyB})`;
        //const gradient = canvasScreen.createLineGradient('#248ADA', '#0E45A9');
        const pattern = canvasScreen.createPattern('sky');
        canvasScreen.drawRectangle({
            x: wallX,
            y: 0,
            width: wallWidth,
            height: wallY,
            color: pattern,
        });
    };
    // # Render Floor
    const renderFloor = (wallX, wallY, wallWidth, wallHeight) => {
        const { r: floorR, g: floorG, b: floorB } = scenario.screen.floor.color;
        const floorColor = `rgb(${floorR}, ${floorG}, ${floorB})`;
        const gradient = canvasScreen.createLineGradient('#303030', '#707070');
        const floorY = wallY + wallHeight;
        canvasScreen.drawRectangle({
            x: wallX,
            y: floorY,
            width: wallWidth,
            height: canvasScreen.getConfig().height - floorY,
            color: gradient,
        });
    };
    // # main Render 3D function
    const render3D = ({ rayAngle, distance, index }) => {
        // # Definitions
        const correctWallDistance = distance * Math.cos(rayAngle - player.get('angle'));
        const distanceProjectionPlane = canvasScreen.getConfig().width / 2 / Math.tan(fovAngle / 2);
        // Define the line height to draw
        const wallHeight = (tileSize / correctWallDistance) * distanceProjectionPlane;
        const wallWidth = Math.ceil(canvasScreen.getConfig().width / raysQuantity);
        // Find positions
        const wallX = index * wallWidth;
        const wallY = canvasScreen.getConfig().height / 2 - wallHeight / 2;
        // Set alpha color to simulate lighting
        const alpha = config.game.render.light / correctWallDistance;
        // Wall color
        const wallColor = `rgba(100,255,100,${alpha})`;
        // # Render
        // Draw Sky
        renderSky(wallX, wallY, wallWidth);
        // Draw wall
        canvasScreen.drawRectangle({
            x: wallX,
            y: wallY,
            width: wallWidth,
            height: wallHeight,
            color: wallColor,
        });
        // Draw Floor
        renderFloor(wallX, wallY, wallWidth, wallHeight);
    };
    // # Ray Casting on horizontal lines
    const castHorizontalRays = ({ rayAngle }) => {
        rayAngle = normalizeAngle(rayAngle);
        const playerY = Math.floor(player.get('y'));
        const playerX = Math.floor(player.get('x'));
        const isRayFacingDown = rayAngle < Math.PI;
        const isRayFacingUp = !isRayFacingDown;
        const isRayFacingRight = rayAngle < PI2 || rayAngle > PI3;
        const isRayFacingLeft = !isRayFacingRight;
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
                tiles[mapPosition] !== 0 // hit wall
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
    const castVerticalRays = ({ rayAngle }) => {
        rayAngle = normalizeAngle(rayAngle);
        const playerY = Math.floor(player.get('y'));
        const playerX = Math.floor(player.get('x'));
        const isRayFacingDown = rayAngle < Math.PI;
        const isRayFacingUp = !isRayFacingDown;
        const isRayFacingRight = rayAngle < PI2 || rayAngle > PI3;
        const isRayFacingLeft = !isRayFacingRight;
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
    // # Cast all Rays
    const castRays = ({ rayAngle }) => {
        const HorRays = castHorizontalRays({ rayAngle });
        const VertRays = castVerticalRays({ rayAngle });
        let distance;
        // Which function gave the lowest value (lowest distance)?
        let rayX, rayY;
        if (VertRays.verticalDistance < HorRays.horizontalDistance) {
            rayX = VertRays.verticalX;
            rayY = VertRays.verticalY;
            distance = VertRays.verticalDistance;
        }
        if (HorRays.horizontalDistance < VertRays.verticalDistance) {
            rayX = HorRays.horizontalX;
            rayY = HorRays.horizontalY;
            distance = HorRays.horizontalDistance;
        }
        return {
            rayX,
            rayY,
            distance,
        };
    };
    // # Debug the Ray on front of player
    const castDebugRay = () => {
        const { rayX, rayY } = castRays({ rayAngle: player.get('angle') });
        debugSingleRay({ toX: rayX, toY: rayY, color: '#BBFF00' });
    };
    // Render everything
    const render = () => {
        // Determine the ray angle of casting acording to player field of view
        let rayAngle = player.get('angle') - fovAngle / 2;
        // Cast debug Ray
        castDebugRay();
        // Cast the rays
        for (let i = 0; i < raysQuantity; i++) {
            // Cast rays
            const { rayX, rayY, distance } = castRays({ rayAngle });
            // 2D ray
            renderRay({ rayX, rayY });
            // 3D wall - This is where we wanted to go
            render3D({ index: i, distance, rayAngle });
            // Increase angle for next ray
            rayAngle += fovAngle / raysQuantity;
        }
    };
    return {
        render,
    };
};
exports.default = RayCasting;

},{"../../../config":4}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RayCasting_1 = require("./RayCasting");
const Scenario = (player, canvasMiniMap, canvasMiniMapDebug, canvasScreen, config) => {
    const { tileSize, tilesX, tilesY, tiles, minimap: { wall: { color: wallColor }, floor: { color: floorColor }, }, } = config;
    const rayCasting = RayCasting_1.default(config, player, canvasMiniMap, canvasMiniMapDebug, canvasScreen);
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
                canvasMiniMapDebug.drawRectangle({
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
        canvasScreen.render();
        rayCasting.render();
    };
    // Render
    const render = () => {
        canvasMiniMap.render();
        canvasMiniMapDebug.render();
        renderTiles();
        renderRays();
    };
    // Return all public functions
    return {
        render,
    };
};
exports.default = Scenario;

},{"./RayCasting":6}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Screen_1 = require("../components/Screen");
const MiniMap_1 = require("../components/MiniMap");
const Player_1 = require("../components/Player");
const Scenario_1 = require("./Scenario");
const config = require("../config");
const Game = () => {
    // constructor
    const screen = new Screen_1.default(config.screen);
    const minimap_singleRay = new MiniMap_1.default(config.miniMapSingleRay);
    const minimap = new MiniMap_1.default(config.miniMapAllRays);
    const player = Player_1.default(minimap, minimap_singleRay, screen);
    const scenario = Scenario_1.default(player, minimap, minimap_singleRay, screen, config.scenario);
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
        scenario.render();
        player.render(keysDown);
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

},{"../components/MiniMap":1,"../components/Player":2,"../components/Screen":3,"../config":4,"./Scenario":7}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = require("./engine");
const engine = engine_1.default();
engine.startGame();

},{"./engine":8}]},{},[9]);
