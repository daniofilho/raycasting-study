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
const Player = (minimap, debugmap, screen, textures) => {
    // Constructor
    const props = Object.assign(Object.assign({}, config.player), {
        fov: config.player.fov * (Math.PI / 180),
        // canvas
        minimap,
        debugmap,
        screen,
        // jump props
        isJumping: false,
        jump: 0,
        jumpVelocity: 0,
        // crouch props
        isCrouching: false,
        // look props
        look: 0,
        moveDirection: 0,
        deltaX: Math.cos(config.player.pod * (Math.PI / 180)),
        deltaY: Math.sin(config.player.pod * (Math.PI / 180)),
    });
    const { tileSize, map } = config.scenario;
    const isPlayerCollidingWall = (x, y) => {
        const deviation = props.size / 2;
        const block = tileSize;
        if (!(map[Math.floor((y + deviation) / block)][Math.floor((x + deviation) / block)] !== 'floor' ||
            map[Math.floor((y - deviation) / block)][Math.floor((x - deviation) / block)] !== 'floor' ||
            map[Math.floor((y + deviation) / block)][Math.floor((x - deviation) / block)] !== 'floor' ||
            map[Math.floor((y - deviation) / block)][Math.floor((x + deviation) / block)] !== 'floor' ||
            map[Math.floor(y / block)][Math.floor(x / block)] !== 'floor')) {
            return false;
        }
        // Debug information
        /*debugmap.drawRectangle({
          x: collisionX,
          y: collisionY,
          width: props.width,
          height: props.height,
          color: 'rgba(0,0,200, 0.5)',
        });
        debugmap.drawRectangle({
          x: mapX,
          y: mapY,
          width: tileSize,
          height: tileSize,
          color: 'rgba(255,100,100,0.5)',
        });*/
        return true;
    };
    // Middlwares for setting props
    const setX = (x) => {
        if (!isPlayerCollidingWall(x, props.y))
            props.x = x;
    };
    const setY = (y) => {
        if (!isPlayerCollidingWall(props.x, y))
            props.y = y;
    };
    const get = (prop) => {
        return props[prop];
    };
    // # Movement
    const turn = (direction) => {
        props.pod += props.turnSpeed * direction;
        if (props.pod >= 360)
            props.pod -= 360;
        if (props.pod < 0)
            props.pod += 360;
        props.deltaX = Math.cos(props.pod * (Math.PI / 180));
        props.deltaY = Math.sin(props.pod * (Math.PI / 180));
    };
    const look = (direction) => {
        props.look += props.turnSpeed * direction * 3;
        if (props.look > 80)
            props.look = 80;
        if (props.look < -80)
            props.look = -80;
    };
    const move = (_speed) => {
        const speed = _speed * props.speed;
        let newX = props.x + Math.cos((props.pod + props.moveDirection) * (Math.PI / 180)) * speed;
        let newY = props.y + Math.sin((props.pod + props.moveDirection) * (Math.PI / 180)) * speed;
        // Colission
        setX(newX);
        setY(newY);
    };
    // # Walk
    const goFront = () => {
        props.moveDirection = 0;
        move(1);
    };
    const goBack = () => {
        props.moveDirection = 180;
        move(0.75);
    };
    // # Strafe
    const strafeLeft = () => {
        props.moveDirection = 270;
        move(0.75);
    };
    const strafeRight = () => {
        props.moveDirection = 90;
        move(0.75);
    };
    // # Turn
    const turnRight = () => {
        turn(1);
    };
    const turnLeft = () => {
        turn(-1);
    };
    // # Look
    const lookUp = () => {
        look(1);
    };
    const lookDown = () => {
        look(-1);
    };
    // # Jump
    const jump = () => {
        if (props.isJumping)
            return;
        props.isJumping = true;
        props.jumpVelocity = props.jumpSpeed;
    };
    const applyGravity = () => {
        props.jump += props.jumpVelocity;
        props.jumpVelocity -= config.game.gravity;
        // Limit player on ground
        if (props.jump <= 0 && props.isJumping) {
            props.isJumping = false;
            props.jump = 0;
        }
    };
    // # Crouch
    const crouch = () => {
        if (props.isJumping)
            return;
        if (props.isCrouching) {
            props.jump = -20;
        }
        else {
            props.jump = 0;
        }
    };
    // Actions on key press
    const handleKeyUp = (keyCodes) => {
        if (keyCodes[39])
            turnRight(); // arrow right
        if (keyCodes[37])
            turnLeft(); // arrow left
        if (keyCodes[83])
            goBack(); // S
        if (keyCodes[87])
            goFront(); // W
        if (keyCodes[65])
            strafeLeft(); // A
        if (keyCodes[68])
            strafeRight(); // D
        if (keyCodes[69])
            lookUp(); // E
        if (keyCodes[67])
            lookDown(); // C
        if (keyCodes[32])
            jump(); // Space
        // Toggle Crouch if Z is pressed
        props.isCrouching = keyCodes[90] ? true : false;
    };
    // Render the player
    const render = (keyCodes) => {
        const { x, y, size, deltaX, deltaY } = props;
        handleKeyUp(keyCodes);
        applyGravity();
        crouch();
        // player body
        props.minimap.drawElipse({ x, y, radius: size, color: '#BBFF00' });
        props.debugmap.drawElipse({
            x,
            y,
            radius: size,
            color: '#BBFF00',
        });
        // player eye direction - single ray debug
        props.debugmap.drawLine({
            x,
            y,
            toX: x + deltaX * config.screen.width,
            toY: y + deltaY * config.screen.height,
            color: '#BBFF00',
        });
    };
    // Render everything that needs to render after everything finished render
    const postRender = () => { };
    // Return all public functions
    return {
        render,
        postRender,
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
const Sprite_1 = require("../../engine/Sprite");
function Textures() {
    let textures = [];
    // Preload textures
    const preload = () => {
        Object.keys(textures_1.default).forEach((key, index) => {
            const img = new Image();
            img.src = textures_1.default[key].image;
            let sprite = null;
            if (textures_1.default[key].isObject) {
                sprite = Sprite_1.default(img);
            }
            textures.push({
                id: key,
                image: img,
                isWall: textures_1.default[key].isWall,
                isObject: textures_1.default[key].isObject,
                isCollidable: textures_1.default[key].isCollidable,
                sprite,
            });
        });
    };
    preload();
    const get = (id) => {
        const r = textures.find((o) => o.id === id);
        //if (!r) return textures[0];
        return r;
    };
    return { get };
}
exports.default = Textures;

},{"../../engine/Sprite":10,"./textures":5}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// All texture sizes must be equal to Tile size width and height!
exports.default = {
    // # "Walls"
    wall: {
        image: 'assets/walls.png',
        isWall: true,
        isObject: false,
        isCollidable: true,
    },
    stone: {
        image: 'assets/stone.png',
        isWall: true,
        isObject: false,
        isCollidable: true,
    },
    jail: {
        image: 'assets/jail.png',
        isWall: true,
        isObject: false,
        isCollidable: true,
    },
    wood: {
        image: 'assets/wood.png',
        isWall: true,
        isObject: false,
        isCollidable: true,
    },
    // # Objects
    table: {
        image: 'assets/table.png',
        isWall: false,
        isObject: true,
        isCollidable: true,
    },
    lamp: {
        image: 'assets/lamp.png',
        isWall: false,
        isObject: true,
        isCollidable: false,
    },
    pillar: {
        image: 'assets/pillar.png',
        isWall: false,
        isObject: true,
        isCollidable: true,
    },
    barrel: {
        image: 'assets/barrel.png',
        isWall: false,
        isObject: true,
        isCollidable: true,
    },
};

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.player = exports.miniMapAllRays = exports.miniMapSingleRay = exports.screen = exports.scenario = exports.game = void 0;
const map_1 = require("./map");
const fogImage = new Image();
fogImage.src = 'assets/sky.png';
const skyImg = new Image();
skyImg.src = 'assets/sky.png';
const floorImg = new Image();
floorImg.src = 'assets/floor.png';
const crosshairImg = new Image();
crosshairImg.src = 'assets/crosshair.png';
const gunImg = new Image();
gunImg.src = 'assets/gun.gif';
exports.game = {
    fps: 30,
    depthfOfField: 3000,
    gravity: 1.7,
    render: {
        wallPixelWidth: 1,
        light: 40,
        fogImage,
        wallHeight: 1100,
    },
};
exports.scenario = {
    tileSize: 64,
    tilesX: map_1.mapWidth,
    tilesY: map_1.mapHeight,
    map: map_1.map,
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
            image: floorImg,
        },
    },
};
exports.screen = {
    canvasID: 'screen',
    backgroundColor: '#333333',
    width: 1024,
    height: 768,
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
    x: 350,
    y: 725,
    pod: 45,
    fov: 90,
    size: exports.scenario.tileSize / 2.5,
    speed: 10,
    turnSpeed: 2,
    jumpSpeed: 6,
    crosshair: {
        image: crosshairImg,
        width: 10,
        height: 10,
    },
    gun: {
        image: gunImg,
        width: 200,
        height: 255,
    },
};

},{"./map":14}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Canvas {
    constructor(config) {
        this.set = (prop, value) => {
            this.canvas[prop] = value;
        };
        // Get some prop
        this.get = (prop) => {
            return this.canvas[prop];
        };
        this.getConfig = (prop) => {
            return this.config[prop];
        };
        this.getContext = () => {
            return this.context;
        };
        // Reset canvas
        this.reset = () => {
            const { width, height, backgroundColor } = this.config;
            this.canvas.width = width;
            this.canvas.height = height;
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
    }
}
exports.default = Canvas;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("../../../config");
const RayCasting = (scenario, player, canvasMinimap, canvasMiniMapDebug, canvasScreen, textures) => {
    const { map, tilesX, tilesY, tileSize } = scenario;
    const props = {
        dof: config.game.depthfOfField,
        fov: player.get('fov'),
        zIndex: [],
        resolution: 1,
        podDistance: 0,
    };
    const canvasWidth = canvasScreen.getConfig('width');
    const canvasHeight = canvasScreen.getConfig('height');
    // # Wall - - - - - - - - - - - - - - - - - - - - - - - -
    const renderWall = (x, wall) => {
        // Wall props
        let size = config.game.render.wallHeight / wall.distance;
        let texture = textures.get(wall.texture);
        let textureX = Math.floor((tileSize / tileSize) * wall.textureX);
        // Check if player is jumping and adjust wall Y
        let jump = (player.get('jump') * 10) / wall.distance;
        let y = canvasHeight / 2 - size / 2 + player.get('look') + jump;
        // Draw
        canvasScreen.drawImage({
            image: texture.image,
            clipX: textureX,
            clipY: 0,
            clipWidth: 1,
            clipHeight: tileSize,
            x,
            y,
            width: 1,
            height: size,
        });
        // Shadow
        if (wall.shadow) {
            canvasScreen.drawRectangle({
                x,
                y,
                width: 1,
                height: size,
                color: 'rgba(0,0,0,0.4)',
            });
        }
        // "light"
        const alpha = 0.2; // @ TODO: make shadow opacity on every wall acoording to distance
        canvasScreen.drawRectangle({
            x,
            y,
            width: 1,
            height: size,
            color: `rgba(0,0,0,${alpha})`,
        });
        //this.renderGround(x, y + size);
    };
    const castWall = (angle) => {
        // Angle correction
        const PI2 = Math.PI * 2;
        angle %= PI2;
        if (angle < 0) {
            angle += PI2;
        }
        // Initial values
        const { tilesX, tilesY, map } = config.scenario;
        const playerX = player.get('x');
        const playerY = player.get('y');
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        const px = playerX / tileSize; // Fix camera position
        const py = playerY / tileSize;
        // Ray Facing diretion
        const rayFacingRight = angle > PI2 * 0.75 || angle < PI2 * 0.25;
        const rayFacingUp = angle < 0 || angle > Math.PI;
        // Define mutable variables
        let shadow = false;
        let rayDirection = 'vertical';
        let dist = 0;
        let textureX;
        let texture;
        //#  Vertical Ray ------
        // Camera slope
        let slope = sin / cos;
        let nextVerticalX = rayFacingRight ? 1 : -1;
        let nextVerticalY = nextVerticalX * slope;
        let verX = rayFacingRight ? Math.ceil(px) : Math.floor(px);
        let verY = py + (verX - px) * slope;
        // Loop all map tiles
        while (verX >= 0 && verX < tilesX && verY >= 0 && verY < tilesY) {
            let wallX = Math.floor(verX + (rayFacingRight ? 0 : -1));
            let wallY = Math.floor(verY);
            // Hitted a floor?
            // @TODO change floor and make based on object "isWall"
            if (map[wallY][wallX] !== 'floor') {
                // Calculate distance from camera to ray
                dist = Math.sqrt(Math.pow(verX - px, 2) + Math.pow(verY - py, 2));
                // Define Texture props
                texture = map[wallY][wallX];
                textureX = (verY * tileSize) % tileSize;
                break;
            }
            // Didn't hit, try next ray (this is the key for algorithm speed)
            verX += nextVerticalX;
            verY += nextVerticalY;
        }
        //#  Horizontal Ray ------
        slope = cos / sin;
        let nextHorizontalY = rayFacingUp ? -1 : 1;
        let nextHorizontalX = nextHorizontalY * slope;
        let horY = rayFacingUp ? Math.floor(py) : Math.ceil(py);
        let horX = px + (horY - py) * slope;
        // Vertical Ray
        while (horX >= 0 && horX < tilesX && horY >= 0 && horY < tilesY) {
            let wallY = Math.floor(horY + (rayFacingUp ? -1 : 0));
            let wallX = Math.floor(horX);
            if (map[wallY][wallX] !== 'floor') {
                let distanceHorizontal = Math.sqrt(Math.pow(horX - px, 2) + Math.pow(horY - py, 2));
                // Only calc this if Vertical distance is higher than horizontal
                if (dist === 0 || distanceHorizontal < dist) {
                    shadow = true;
                    dist = distanceHorizontal;
                    texture = map[wallY][wallX];
                    textureX = (horX * tileSize) % tileSize;
                    rayDirection = 'horizontal';
                }
                break;
            }
            horX += nextHorizontalX;
            horY += nextHorizontalY;
        }
        // Store ray distance
        props.zIndex.push(dist);
        // Fix distance to avoid fish eye effect
        dist *= Math.cos(player.get('pod') * (Math.PI / 180) - angle);
        // Set shadow according to ray direction
        shadow = rayDirection === 'horizontal';
        // Debug ray
        let toX = rayDirection === 'vertical' ? verX : horX;
        toX *= tileSize;
        let toY = rayDirection === 'vertical' ? verY : horY;
        toY *= tileSize;
        canvasMinimap.drawLine({
            x: playerX,
            y: playerY,
            toX: toX,
            toY: toY,
            color: '#BBFF00',
        });
        // Return Ray props
        return {
            distance: dist,
            texture: texture,
            textureX: textureX,
            shadow: shadow,
        };
    };
    const renderWalls = () => {
        props.zIndex = [];
        const pod = player.get('pod');
        // Set base resolution according to canvas width
        let resolution = Math.ceil(canvasWidth / props.resolution);
        // For each resolution, cast a wall
        for (let x = 0; x < resolution; x++) {
            let viewDist = canvasWidth / props.resolution / Math.tan(props.fov / 2);
            let rayx = (-resolution / 2 + x) * props.resolution;
            let rayDist = Math.sqrt(rayx * rayx + viewDist * viewDist);
            let rayAngle = Math.asin(rayx / rayDist);
            let wall = castWall(pod * (Math.PI / 180) + rayAngle);
            if (x === resolution / 2) {
                props.podDistance = wall.distance;
            }
            renderWall(x, wall);
        }
    };
    // - - - - - - - - - - - - - - - - - - - - - - - -
    // Render everything
    const render = () => {
        renderWalls();
    };
    return {
        render,
    };
};
exports.default = RayCasting;

},{"../../../config":6}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RayCasting_1 = require("./RayCasting");
const Scenario = (player, canvasMiniMap, canvasMiniMapDebug, canvasScreen, config, textures) => {
    const { tileSize, tilesX, tilesY, map, minimap: { wall: { color: wallColor }, floor: { color: floorColor }, }, } = config;
    const rayCasting = RayCasting_1.default(config, player, canvasMiniMap, canvasMiniMapDebug, canvasScreen, textures);
    // Tiles
    const renderTiles = () => {
        // Loop tiles
        new Array(tilesY).fill('').forEach((_, y) => {
            new Array(tilesX).fill('').forEach((_, x) => {
                const x0 = x * tileSize;
                const y0 = y * tileSize;
                // Define tile color based on tile value (0,1)
                const tileColor = map[y][x] !== 'floor' ? wallColor : floorColor;
                const objectTexture = textures.get(map[y][x]);
                if (objectTexture) {
                    // Minimap
                    canvasMiniMap.drawImage({
                        image: objectTexture.image,
                        x: x0,
                        y: y0,
                        width: tileSize,
                        height: tileSize,
                        clipX: 0,
                        clipY: 0,
                        clipWidth: tileSize,
                        clipHeight: tileSize,
                    });
                    canvasMiniMapDebug.drawImage({
                        image: objectTexture.image,
                        x: x0,
                        y: y0,
                        width: tileSize,
                        height: tileSize,
                        clipX: 0,
                        clipY: 0,
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
const calculations_1 = require("../calculations");
const config_1 = require("../../config");
function Sprite(image) {
    const props = {
        image,
        x: 0,
        y: 0,
        visible: false,
        distance: 0,
        angle: 0,
    };
    const get = (prop) => {
        return props[prop];
    };
    const calcDistance = (camera, x, y) => {
        // Distance
        props.distance = calculations_1.calcDistanceBetweenPoints(camera.get('x'), camera.get('y'), x, y);
    };
    const updateProps = (camera, x, y) => {
        props.x = x;
        props.y = y;
        const cameraFOV = camera.get('fieldOfView');
        const halfFOV = calculations_1.convertAngleToRadians(cameraFOV / 2);
        // Angle
        props.angle = calculations_1.calcAngle({
            cameraX: camera.get('x'),
            cameraY: camera.get('y'),
            cameraAngle: camera.get('angle'),
            targetX: props.x,
            targetY: props.y,
        });
        props.visible = props.angle < halfFOV * 1.5 ? true : false; // 1.5 margin error adjust
        calcDistance(camera, props.x, props.y);
    };
    const render = (camera, canvas, x, y, rayDistances) => {
        updateProps(camera, x, y);
        if (!props.visible)
            return;
        const canvasWidth = canvas.getConfig().width;
        const canvasHeight = canvas.getConfig().height;
        const FOV = camera.get('fieldOfView');
        const spriteX = props.x - camera.get('x');
        const spriteY = props.y - camera.get('y');
        const spriteAngle = Math.atan2(spriteY, spriteX) - camera.get('angle'); // check this angle
        const distanceProjectionPlane = canvasWidth / 2 / Math.tan(FOV / 2);
        const spriteHeight = (canvasHeight / props.distance) * distanceProjectionPlane * 2;
        // Calculate where line starts and ends, centering on screen vertically
        const y0 = Math.floor(canvasHeight / 2) - Math.floor(spriteHeight / 2);
        const y1 = y0 + spriteHeight;
        const maxTextureHeight = config_1.scenario.tileSize;
        const maxTextureWidth = config_1.scenario.tileSize;
        const textureHeight = y0 - y1;
        const textureWidth = textureHeight; // Square sprites
        // Calculate Sprite coordinates
        const viewDist = canvas.getConfig().height; // OK
        const x0 = Math.tan(spriteAngle) * viewDist; // The glitch on sprite probably here
        const xFinal = canvasWidth / 2 + x0 - textureWidth / 2;
        // X Height proportion
        const columnHeight = textureHeight / maxTextureHeight;
        // Render column by column so we can check if it's behind a wall
        for (let i = 0; i < maxTextureWidth; i++) {
            for (let j = 0; j < columnHeight; j++) {
                const x1 = Math.floor(xFinal + (i - 1) * columnHeight + j); // The glitch on sprite probably here
                // Check distance before render column
                if (rayDistances[x1] > props.distance && props.distance < config_1.game.depthfOfField) {
                    canvas.drawImage({
                        image: props.image,
                        clipX: i,
                        clipY: 0,
                        clipWidth: 1,
                        clipHeight: maxTextureHeight - 1,
                        x: x1,
                        y: y1,
                        width: 1,
                        height: textureHeight,
                    });
                }
            }
        }
    };
    return { render, get, calcDistance };
}
exports.default = Sprite;

},{"../../config":6,"../calculations":11}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numIsMultipleOf = exports.calcDistanceBetweenPoints = exports.calcAngle = exports.convertAngleToRadians = exports.calcDistance = exports.normalizeAngle = void 0;
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
    return Math.abs(angleDifference);
};
// Calculate distance between two points
exports.calcDistanceBetweenPoints = (x1, y1, x2, y2) => {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
};
// Check if a number is multiple of anotar
exports.numIsMultipleOf = (M, N) => {
    // Formula => M = N * K
    // Se K for um número inteiro, então é múltiplo
    const K = M / N;
    return Number.isInteger(K);
};

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line
const Stats = require('stats.js'); // This method is required for Stats JS to work with Typescript
const Screen_1 = require("../components/Screen");
const MiniMap_1 = require("../components/MiniMap");
const Player_1 = require("../components/Player");
const Textures_1 = require("../components/Textures");
const Scenario_1 = require("./Scenario");
const config = require("../config");
const Game = () => {
    // FPS Status
    const FPSstats = new Stats();
    FPSstats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(FPSstats.dom);
    const textures = Textures_1.default();
    const screen = new Screen_1.default(config.screen);
    const minimap_singleRay = new MiniMap_1.default(config.miniMapSingleRay);
    const minimap = new MiniMap_1.default(config.miniMapAllRays);
    const player = Player_1.default(minimap, minimap_singleRay, screen, textures);
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
        //player.postRender();
    };
    // # "Thread" tha runs the game
    const runGame = (fps) => {
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
exports.default = Game;

},{"../components/MiniMap":1,"../components/Player":2,"../components/Screen":3,"../components/Textures":4,"../config":6,"./Scenario":9,"stats.js":15}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = require("./engine");
window.global = {
    renderTextures: true,
};
// Start the engine
const engine = engine_1.default();
engine.startGame();

},{"./engine":12}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapHeight = exports.mapWidth = exports.map = void 0;
//https://onlinetexttools.com/convert-text-to-nice-columns <= beautify this array - Right-align columns
// prettier-ignore
const map = [
    ['stone', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'stone', 'stone', 'stone', 'stone', 'stone', 'floor', 'floor', 'floor', 'floor', 'wood', 'floor', 'wood', 'floor', 'wood', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'stone', 'floor', 'floor', 'floor', 'stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'stone', 'floor', 'floor', 'floor', 'stone', 'floor', 'floor', 'floor', 'floor', 'wood', 'floor', 'floor', 'floor', 'wood', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'stone', 'floor', 'floor', 'floor', 'stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'stone', 'stone', 'floor', 'stone', 'stone', 'floor', 'floor', 'floor', 'floor', 'wood', 'floor', 'wood', 'floor', 'wood', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'jail', 'jail', 'jail', 'jail', 'jail', 'jail', 'jail', 'jail', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'jail', 'floor', 'jail', 'floor', 'floor', 'floor', 'floor', 'jail', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'jail', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'jail', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'jail', 'floor', 'jail', 'floor', 'floor', 'floor', 'floor', 'jail', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'jail', 'floor', 'jail', 'jail', 'jail', 'jail', 'jail', 'jail', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'jail', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'jail', 'jail', 'jail', 'jail', 'jail', 'jail', 'jail', 'jail', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
];
exports.map = map;
const mapWidth = map[0].length;
exports.mapWidth = mapWidth;
const mapHeight = map.length;
exports.mapHeight = mapHeight;

},{}],15:[function(require,module,exports){
// stats.js - http://github.com/mrdoob/stats.js
(function(f,e){"object"===typeof exports&&"undefined"!==typeof module?module.exports=e():"function"===typeof define&&define.amd?define(e):f.Stats=e()})(this,function(){var f=function(){function e(a){c.appendChild(a.dom);return a}function u(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();
u(++l%c.children.length)},!1);var k=(performance||Date).now(),g=k,a=0,r=e(new f.Panel("FPS","#0ff","#002")),h=e(new f.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var t=e(new f.Panel("MB","#f08","#201"));u(0);return{REVISION:16,dom:c,addPanel:e,showPanel:u,begin:function(){k=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();h.update(c-k,200);if(c>g+1E3&&(r.update(1E3*a/(c-g),100),g=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/
1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){k=this.end()},domElement:c,setMode:u}};f.Panel=function(e,f,l){var c=Infinity,k=0,g=Math.round,a=g(window.devicePixelRatio||1),r=80*a,h=48*a,t=3*a,v=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=h;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,h);b.fillStyle=f;b.fillText(e,t,v);
b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(h,w){c=Math.min(c,h);k=Math.max(k,h);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=f;b.fillText(g(h)+" "+e+" ("+g(c)+"-"+g(k)+")",t,v);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,g((1-h/w)*p))}}};return f});

},{}]},{},[13]);
