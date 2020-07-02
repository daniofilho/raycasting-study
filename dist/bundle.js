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

},{"../../engine/Canvas":7}],2:[function(require,module,exports){
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

},{"../../config":6}],3:[function(require,module,exports){
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

},{"../../engine/Canvas":7}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const textures_1 = require("./textures");
function Textures() {
    let textures = [];
    // Preload textures
    const preload = () => {
        Object.keys(textures_1.default).forEach((key, index) => {
            const img = new Image();
            img.src = textures_1.default[key].image;
            textures.push({
                id: key,
                image: img,
                vertical: textures_1.default[key].vertical,
                horizontal: textures_1.default[key].horizontal,
                isWall: textures_1.default[key].isWall,
            });
        });
    };
    preload();
    const get = (id) => {
        const r = textures.find((o) => o.id === id);
        // can be string on number
        return r;
    };
    return { get };
}
exports.default = Textures;

},{"./textures":5}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// All texture sizes must be equal to Tile size!
exports.default = {
    wall: {
        image: 'assets/walls.png',
        horizontal: {
            clipX: 0,
            clipY: 0,
        },
        vertical: {
            clipX: 64,
            clipY: 0,
        },
        isWall: true,
    },
    stone: {
        image: 'assets/walls.png',
        horizontal: {
            clipX: 0,
            clipY: 128,
        },
        vertical: {
            clipX: 64,
            clipY: 128,
        },
        isWall: true,
    },
    jail: {
        image: 'assets/walls.png',
        horizontal: {
            clipX: 0,
            clipY: 64,
        },
        vertical: {
            clipX: 64,
            clipY: 64,
        },
        isWall: true,
    },
    wood: {
        image: 'assets/walls.png',
        horizontal: {
            clipX: 0,
            clipY: 192,
        },
        vertical: {
            clipX: 64,
            clipY: 192,
        },
        isWall: true,
    },
};

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.player = exports.miniMapAllRays = exports.miniMapSingleRay = exports.screen = exports.scenario = exports.game = void 0;
const map_1 = require("./map");
exports.game = {
    fps: 60,
    depthfOfField: 50,
    render: {
        light: 40,
    },
};
const skyImg = new Image();
skyImg.src = 'assets/sky.png';
exports.scenario = {
    tileSize: 64,
    tilesX: 15,
    tilesY: 19,
    // prettier-ignore
    tiles: map_1.default,
    minimap: {
        wall: { color: '#008800' },
        floor: { color: '#707070' },
    },
    screen: {
        sky: {
            color: { r: 44, g: 44, b: 44 },
            image: skyImg,
        },
        floor: {
            color: {
                from: '#505050',
                to: '#707070',
            },
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
    relativeWidth: 290,
    relativeHeight: 317,
    x: exports.screen.width - 100,
    y: exports.screen.height - 100,
};
exports.miniMapAllRays = {
    canvasID: 'minimap_allRays',
    backgroundColor: '#000',
    opacity: 1,
    width: exports.scenario.tilesX * exports.scenario.tileSize,
    height: exports.scenario.tilesY * exports.scenario.tileSize,
    relativeWidth: 290,
    relativeHeight: 317,
    x: exports.screen.width - 100,
    y: exports.screen.height - 100,
};
exports.player = {
    x: exports.miniMapAllRays.width / 2,
    y: exports.miniMapAllRays.height / 2,
    width: exports.scenario.tileSize / 2.5,
    height: exports.scenario.tileSize / 2.5,
    color: '#FFFF00',
    speed: 2,
    turnSpeed: 0.05,
    fieldOfView: 60,
};

},{"./map":13}],7:[function(require,module,exports){
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
        this.createPattern = (img) => {
            return this.context.createPattern(img, 'repeat');
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
        // Draw an image on Canvas
        this.drawImage = ({ image, x, y, width, height, clipX, clipY, clipWidth, clipHeight, }) => {
            this.context.imageSmoothingEnabled = false; // Pixelate image
            if (clipWidth && clipHeight) {
                return this.context.drawImage(image, clipX, clipY, clipWidth, clipHeight, x, y, width, height);
            }
            this.context.drawImage(image, x, y, width, height);
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

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("../../../config");
const calculations_1 = require("../../calculations");
// Math PI relative variables - pure matemagician here
const PI2 = Math.PI / 2;
const PI3 = (3 * Math.PI) / 2;
const RayCasting = (scenario, player, canvasMinimap, canvasMiniMapDebug, canvasScreen, textures) => {
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
        if (window.global.renderTextures) {
            const pattern = canvasScreen.createPattern(scenario.screen.sky.image);
            return canvasScreen.drawRectangle({
                x: wallX,
                y: 0,
                width: wallWidth,
                height: wallY,
                color: pattern,
            });
        }
        const { r: skyR, g: skyG, b: skyB } = scenario.screen.sky.color;
        const skyColor = `rgb(${skyR}, ${skyG}, ${skyB})`;
        return canvasScreen.drawRectangle({
            x: wallX,
            y: 0,
            width: wallWidth,
            height: wallY,
            color: skyColor,
        });
    };
    const renderObject = ({ pixelOfTexture, objectId, wallHeight, wallWidth, wallY, wallX, horizontalRay, alpha, }) => {
        if (window.global.renderTextures) {
            const objectTexture = textures.get(objectId);
            if (!objectTexture)
                return;
            const clip = horizontalRay ? objectTexture.horizontal : objectTexture.vertical;
            return canvasScreen.drawImage({
                image: objectTexture.image,
                x: wallX,
                y: wallY,
                width: tileSize,
                height: wallHeight,
                clipX: clip.clipX + Math.floor(pixelOfTexture),
                clipY: clip.clipY,
                clipWidth: tileSize,
                clipHeight: tileSize,
            });
        }
        // # Wall texture
        const wallColor = `rgba(100,255,100,${alpha})`;
        return canvasScreen.drawRectangle({
            x: wallX,
            y: wallY,
            width: wallWidth,
            height: wallHeight,
            color: wallColor,
        });
    };
    // # Render Floor
    const renderFloor = (wallX, wallY, wallWidth, wallHeight) => {
        //const { r: floorR, g: floorG, b: floorB } = scenario.screen.floor.color;
        //const floorColor = `rgb(${floorR}, ${floorG}, ${floorB})`;
        const gradient = canvasScreen.createLineGradient(scenario.screen.floor.color.from, scenario.screen.floor.color.to);
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
    const render3D = ({ rayAngle, distance, index, objectId, pixelOfTexture, horizontalRay, }) => {
        // # Definitions
        const correctWallDistance = distance * Math.cos(rayAngle - player.get('angle'));
        const distanceProjectionPlane = canvasScreen.getConfig().width / 2 / Math.tan(fovAngle / 2);
        // Define the line height to draw
        const wallHeight = Math.round((tileSize / correctWallDistance) * distanceProjectionPlane);
        const wallWidth = Math.ceil(canvasScreen.getConfig().width / raysQuantity);
        // Find positions
        const wallX = index * wallWidth;
        const wallY = canvasScreen.getConfig().height / 2 - wallHeight / 2;
        // Set alpha color to simulate lighting
        const alpha = config.game.render.light / correctWallDistance;
        // # Render
        // Draw Sky
        renderSky(wallX, wallY, wallWidth);
        // Draw wall
        renderObject({
            objectId,
            pixelOfTexture,
            horizontalRay,
            wallWidth,
            wallHeight,
            wallX,
            wallY,
            alpha,
        });
        // Draw Floor
        renderFloor(wallX, wallY, wallWidth, wallHeight);
    };
    // # Ray Casting on horizontal lines
    const castHorizontalRays = ({ rayAngle }) => {
        rayAngle = calculations_1.normalizeAngle(rayAngle);
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
                horizontalDistance = calculations_1.calcDistance({
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
            objectId: tiles[mapPosition],
        };
    };
    // # Ray Casting on vertical lines
    const castVerticalRays = ({ rayAngle }) => {
        rayAngle = calculations_1.normalizeAngle(rayAngle);
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
                tiles[mapPosition] !== 0 // hit wall
            ) {
                // Save values to check lowest later
                verticalX = rayX;
                verticalY = rayY;
                verticalDistance = calculations_1.calcDistance({
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
            objectId: tiles[mapPosition],
        };
    };
    // # Cast all Rays
    const castRays = ({ rayAngle }) => {
        const HorRays = castHorizontalRays({ rayAngle });
        const VertRays = castVerticalRays({ rayAngle });
        let distance;
        // Which function gave the lowest value (lowest distance)?
        let rayX, rayY, objectId, pixelOfTexture, horizontalRay;
        if (VertRays.verticalDistance < HorRays.horizontalDistance) {
            // # Rays props
            rayX = VertRays.verticalX;
            rayY = VertRays.verticalY;
            // # Object props
            distance = VertRays.verticalDistance;
            objectId = VertRays.objectId;
            // Define the correct pixel to render of texture
            let aux = Math.floor(rayY / tileSize);
            aux = aux * tileSize;
            pixelOfTexture = rayY - aux;
            // came from which ray
            horizontalRay = true;
        }
        if (HorRays.horizontalDistance < VertRays.verticalDistance) {
            // # Ray props
            rayX = HorRays.horizontalX;
            rayY = HorRays.horizontalY;
            // # Object props
            distance = HorRays.horizontalDistance;
            objectId = HorRays.objectId;
            // Define the correct pixel to render of texture
            let aux = Math.floor(rayX / tileSize);
            aux = aux * tileSize;
            pixelOfTexture = rayX - aux;
            // Facing direction
            horizontalRay = false;
        }
        return {
            rayX,
            rayY,
            distance,
            objectId,
            pixelOfTexture,
            horizontalRay,
        };
    };
    // # Debug the Ray on front of player
    const castDebugRay = () => {
        const { rayX, rayY } = castRays({ rayAngle: player.get('angle') });
        debugSingleRay({ toX: rayX, toY: rayY, color: '#BBFF00' });
    };
    // # Render all objects
    const renderObjects = (renderObjects) => {
        renderObjects.map(({ rayX, rayY, rayAngle, distance, rayNumber, pixelOfTexture, objectId, horizontalRay }) => {
            // 2D ray
            renderRay({ rayX, rayY });
            // 3D wall - This is where we wanted to go
            render3D({ index: rayNumber, objectId, distance, horizontalRay, pixelOfTexture, rayAngle });
        });
    };
    // Render everything
    const render = () => {
        const objects = [];
        // Determine the ray angle of casting acording to player field of view
        let rayAngle = player.get('angle') - fovAngle / 2;
        // Cast debug Ray
        castDebugRay();
        // Cast the rays
        new Array(raysQuantity).fill('').forEach((_, ray) => {
            // Cast rays
            const { rayX, rayY, distance, objectId, pixelOfTexture, horizontalRay } = castRays({
                rayAngle,
            });
            objects.push({
                rayX,
                rayY,
                rayAngle,
                distance,
                objectId,
                pixelOfTexture,
                horizontalRay,
                rayNumber: ray,
            });
            // Increase angle for next ray
            rayAngle += fovAngle / raysQuantity;
        });
        // Finaly render everything found
        return renderObjects(objects);
    };
    return {
        render,
    };
};
exports.default = RayCasting;

},{"../../../config":6,"../../calculations":10}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RayCasting_1 = require("./RayCasting");
const Scenario = (player, canvasMiniMap, canvasMiniMapDebug, canvasScreen, config, textures) => {
    const { tileSize, tilesX, tilesY, tiles, minimap: { wall: { color: wallColor }, floor: { color: floorColor }, }, } = config;
    const rayCasting = RayCasting_1.default(config, player, canvasMiniMap, canvasMiniMapDebug, canvasScreen, textures);
    // Tiles
    const renderTiles = () => {
        // Loop tiles
        new Array(tilesX).fill('').forEach((_, x) => {
            new Array(tilesY).fill('').forEach((_, y) => {
                const x0 = x * tileSize;
                const y0 = y * tileSize;
                // Define tile color based on tile value (0,1)
                const tileColor = tiles[y * tilesX + x] !== 0 ? wallColor : floorColor;
                const mapPosition = y * tilesX + x;
                const objectTexture = textures.get(tiles[mapPosition]);
                if (objectTexture) {
                    // Minimap
                    canvasMiniMap.drawImage({
                        image: objectTexture.image,
                        x: x0,
                        y: y0,
                        width: tileSize,
                        height: tileSize,
                        clipX: objectTexture.horizontal.clipX,
                        clipY: objectTexture.horizontal.clipY,
                        clipWidth: tileSize,
                        clipHeight: tileSize,
                    });
                    canvasMiniMapDebug.drawImage({
                        image: objectTexture.image,
                        x: x0,
                        y: y0,
                        width: tileSize,
                        height: tileSize,
                        clipX: objectTexture.horizontal.clipX,
                        clipY: objectTexture.horizontal.clipY,
                        clipWidth: tileSize,
                        clipHeight: tileSize,
                    });
                    return;
                }
                canvasMiniMap.drawRectangle({
                    x: x0,
                    y: y0,
                    width: tileSize,
                    height: tileSize,
                    color: tileColor,
                });
                canvasMiniMapDebug.drawRectangle({
                    x: x0,
                    y: y0,
                    width: tileSize,
                    height: tileSize,
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

},{"./RayCasting":8}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcAngle = exports.convertAngleToRadians = exports.calcDistance = exports.normalizeAngle = void 0;
exports.normalizeAngle = (angle) => {
    angle = angle % (2 * Math.PI);
    if (angle < 0) {
        angle = 2 * Math.PI + angle;
    }
    return angle;
};
// Determine the distance between player and "ray hit" point
exports.calcDistance = ({ object, target }) => {
    return Math.sqrt((target.x - object.x) * (target.x - object.x) + (target.y - object.y) * (target.y - object.y));
};
// Convert angle to radians
exports.convertAngleToRadians = (angle) => {
    return angle * (Math.PI / 180);
};
// Calculate angle based on player position and angle
exports.calcAngle = ({ cameraX, cameraY, cameraAngle, targetX, targetY }) => {
    var vectX = targetX - cameraX;
    var vectY = targetY - cameraY;
    var anglePlayerObject = Math.atan2(vectY, vectX);
    var angleDifference = cameraAngle - anglePlayerObject;
    if (angleDifference < -Math.PI)
        angleDifference += 2.0 * Math.PI;
    if (angleDifference > Math.PI)
        angleDifference -= 2.0 * Math.PI;
    return {
        angle: Math.abs(angleDifference),
    };
};

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Screen_1 = require("../components/Screen");
const MiniMap_1 = require("../components/MiniMap");
const Player_1 = require("../components/Player");
const Textures_1 = require("../components/Textures");
const Scenario_1 = require("./Scenario");
const config = require("../config");
const Game = () => {
    // constructor
    const textures = Textures_1.default();
    const screen = new Screen_1.default(config.screen);
    const minimap_singleRay = new MiniMap_1.default(config.miniMapSingleRay);
    const minimap = new MiniMap_1.default(config.miniMapAllRays);
    const player = Player_1.default(minimap, minimap_singleRay, screen);
    const scenario = Scenario_1.default(player, minimap, minimap_singleRay, screen, config.scenario, textures);
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

},{"../components/MiniMap":1,"../components/Player":2,"../components/Screen":3,"../components/Textures":4,"../config":6,"./Scenario":9}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = require("./engine");
window.global = {
    renderTextures: true,
};
// Start the engine
const engine = engine_1.default();
engine.startGame();

},{"./engine":11}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// prettier-ignore
exports.default = [
    'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall',
    'wall', 0, 0, 'jail', 0, 0, 0, 0, 0, 0, 'wall', 0, 0, 0, 'wood',
    'wall', 0, 'wall', 'wall', 0, 0, 0, 0, 0, 0, 'wall', 0, 0, 0, 'wood',
    'wall', 0, 0, 'jail', 0, 0, 'stone', 'stone', 'stone', 0, 'wall', 0, 0, 0, 'wood',
    'wall', 0, 'wall', 'wall', 0, 0, 0, 0, 'stone', 0, 'wall', 'wall', 'wall', 0, 'wood',
    'wall', 0, 0, 'jail', 0, 0, 0, 0, 'stone', 0, 0, 0, 0, 0, 'wood',
    'wall', 0, 'wall', 'wall', 0, 'stone', 'stone', 'stone', 'stone', 0, 0, 0, 0, 0, 'wood',
    'wall', 0, 0, 0, 0, 'stone', 0, 0, 0, 0, 0, 0, 0, 0, 'wood',
    'wall', 0, 0, 0, 0, 'stone', 0, 0, 0, 0, 0, 0, 0, 0, 'wood',
    'wall', 0, 0, 0, 0, 'stone', 0, 0, 0, 0, 0, 'jail', 'wall', 'wall', 'wood',
    'wall', 0, 0, 0, 0, 'stone', 'stone', 'stone', 'stone', 0, 0, 0, 'wall', 0, 'wood',
    'wall', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'wall', 0, 'wood',
    'wall', 0, 0, 0, 0, 0, 0, 0, 0, 0, 'wall', 'wall', 'wall', 0, 'wood',
    'wall', 0, 0, 0, 'wall', 'wall', 0, 0, 0, 0, 'wall', 0, 0, 0, 'wood',
    'wall', 0, 0, 0, 'wall', 0, 0, 0, 0, 0, 'wall', 0, 0, 0, 'wood',
    'wall', 0, 0, 0, 'wall', 0, 0, 'stone', 0, 0, 'wall', 0, 0, 0, 'wood',
    'wall', 0, 0, 'wall', 'wall', 0, 0, 0, 0, 0, 0, 0, 0, 0, 'wood',
    'wall', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'wood',
    'wall', 'wood', 'wood', 'wood', 'wood', 'wood', 'wood', 'wood', 'wood', 'wood', 'wood', 'wood', 'wood', 'wood', 'wood',
];

},{}]},{},[12]);
