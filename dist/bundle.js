(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.player = exports.miniMapAllRays = exports.miniMapSingleRay = exports.game = exports.scenario = exports.screen = void 0;
const InitialMap = require("./map");
const skyImg = new Image();
skyImg.src = 'assets/sky.jpg';
const crosshairImg = new Image();
crosshairImg.src = 'assets/crosshair.png';
const gunImg = new Image();
gunImg.src = 'assets/gun.gif';
exports.screen = {
    canvasID: 'screen',
    backgroundColor: '#333333',
    width: 800,
    height: 600,
};
exports.scenario = {
    tileSize: 32,
    tilesX: InitialMap.map.width,
    tilesY: InitialMap.map.height,
    map: InitialMap.map.tiles,
    screen: {
        sky: {
            image: skyImg,
            width: exports.screen.width * 0.8,
            height: exports.screen.height * 0.5,
        },
    },
};
exports.game = {
    fps: 30,
    gravity: 1.5,
    render: {
        wallHeight: exports.screen.height * 1.5,
        maxDistanceVisible: 20,
    },
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
    x: InitialMap.player.x * exports.scenario.tileSize,
    y: InitialMap.player.y * exports.scenario.tileSize,
    pod: InitialMap.player.pod,
    fov: 90,
    size: exports.scenario.tileSize / 2.5,
    speed: 10,
    turnSpeed: 3,
    jumpSpeed: 8,
    crosshair: {
        image: crosshairImg,
        width: 10,
        height: 10,
    },
    gun: {
        image: gunImg,
        width: exports.screen.width / 2,
        height: exports.screen.width / 2,
    },
};

},{"./map":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.player = exports.map = void 0;
// prettier-ignore
const tiles = [
    ['stone', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'lamp', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'stone', 'stone', 'stone', 'stone', 'stone', 'floor', 'floor', 'floor', 'floor', 'wood', 'floor', 'wood', 'floor', 'wood', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'stone', 'floor', 'floor', 'floor', 'stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'stone', 'floor', 'floor', 'floor', 'stone', 'floor', 'floor', 'floor', 'floor', 'wood', 'floor', 'floor', 'floor', 'wood', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'stone', 'floor', 'floor', 'floor', 'stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'stone', 'stone', 'floor', 'stone', 'stone', 'pillar', 'floor', 'floor', 'floor', 'wood', 'floor', 'wood', 'floor', 'wood', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'floor', 'table', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'jail', 'jail', 'jail', 'jail', 'jail', 'jail', 'jail', 'jail', 'pillar', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'jail', 'floor', 'jail', 'floor', 'floor', 'floor', 'floor', 'jail', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'jail', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'jail', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'jail', 'floor', 'jail', 'floor', 'floor', 'floor', 'floor', 'jail', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'jail', 'floor', 'jail', 'jail', 'jail', 'jail', 'jail', 'jail', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'jail', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'jail', 'jail', 'jail', 'jail', 'jail', 'jail', 'jail', 'jail', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ['stone', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
];
const map = {
    tiles,
    width: tiles[0].length,
    height: tiles.length,
};
exports.map = map;
const player = {
    x: 8.5,
    y: 6,
    pod: 90,
};
exports.player = player;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// All texture sizes must be equal to Tile size width and height!
exports.default = {
    // # "Floors"
    floor: {
        image: 'assets/floor.jpg',
        isWall: false,
        isObject: false,
        isCollidable: false,
        isLight: false,
    },
    // # "Walls"
    wall: {
        image: 'assets/wall.png',
        isWall: true,
        isObject: false,
        isCollidable: true,
        isLight: false,
    },
    stone: {
        image: 'assets/stone.png',
        isWall: true,
        isObject: false,
        isCollidable: true,
        isLight: false,
    },
    jail: {
        image: 'assets/jail.png',
        isWall: true,
        isObject: false,
        isCollidable: true,
        isLight: false,
    },
    wood: {
        image: 'assets/wood.png',
        isWall: true,
        isObject: false,
        isCollidable: true,
        isLight: false,
    },
    // # Objects
    table: {
        image: 'assets/table.png',
        isWall: false,
        isObject: true,
        isCollidable: true,
        isLight: false,
    },
    lamp: {
        image: 'assets/lamp.png',
        isWall: false,
        isObject: true,
        isCollidable: false,
        isLight: true,
    },
    pillar: {
        image: 'assets/pillar.png',
        isWall: false,
        isObject: true,
        isCollidable: true,
        isLight: false,
    },
    barrel: {
        image: 'assets/barrel.png',
        isWall: false,
        isObject: true,
        isCollidable: true,
        isLight: false,
    },
};

},{}],4:[function(require,module,exports){
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
        this.drawElipse = ({ x, y, radius, color = '#FFF', fillColor = 'rgba(0,0,0,0)' }) => {
            const { context } = this;
            context.strokeStyle = color;
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI);
            context.fillStyle = fillColor;
            context.fill();
            context.stroke();
        };
        // Draw an image on Canvas
        this.doDrawImage = ({ image, x, y, width, height, clipX, clipY, clipWidth, clipHeight, opacity = 1, }) => {
            if (clipWidth && clipHeight) {
                return this.context.drawImage(image, clipX, clipY, clipWidth, clipHeight, x, y, width, height);
            }
            this.context.drawImage(image, x, y, width, height);
        };
        this.drawImage = (params) => {
            const { filter } = params;
            this.context.imageSmoothingEnabled = false; // Pixelate image
            // Will draw with filter?
            if (filter)
                this.context.filter = filter;
            this.doDrawImage(params);
            // Reset filter
            if (filter)
                this.context.filter = 'none';
        };
        this.canvas = document.getElementById(config.canvasID);
        this.context = this.canvas.getContext('2d');
        this.config = config;
    }
}
exports.default = Canvas;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Canvas_1 = require("../Canvas");
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

},{"../Canvas":4}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("../../config/config");
const Player = (minimap, debugmap, screen, textures, configScenario) => {
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
    const { tileSize, map } = configScenario;
    const canvasWidth = screen.getConfig('width');
    const canvasHeight = screen.getConfig('height');
    const isPlayerColliding = (x, y) => {
        const deviation = props.size / 2;
        const block = tileSize;
        // Check if there is an object inside next coordinates
        const target1 = textures.get(map[Math.floor((y + deviation) / block)][Math.floor((x + deviation) / block)]);
        const target2 = textures.get(map[Math.floor((y - deviation) / block)][Math.floor((x - deviation) / block)]);
        const target3 = textures.get(map[Math.floor((y + deviation) / block)][Math.floor((x - deviation) / block)]);
        const target4 = textures.get(map[Math.floor((y - deviation) / block)][Math.floor((x + deviation) / block)]);
        const target5 = textures.get(map[Math.floor(y / block)][Math.floor(x / block)]);
        if (!(target1.isCollidable ||
            target2.isCollidable ||
            target3.isCollidable ||
            target4.isCollidable ||
            target5.isCollidable)) {
            return false;
        }
        return true;
    };
    // Middlwares for setting props
    const setX = (x) => {
        if (!isPlayerColliding(x, props.y))
            props.x = x;
    };
    const setY = (y) => {
        if (!isPlayerColliding(props.x, y))
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
        move(0.25);
    };
    const strafeRight = () => {
        props.moveDirection = 90;
        move(0.25);
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
            props.jump = screen.getConfig('height') / 1000 - 10;
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
    // Draw player body on inimaps
    const drawPlayerBody = () => {
        if (!window.global.renderTextures)
            return;
        const { x, y, size } = props;
        props.minimap.drawElipse({ x, y, radius: size, color: '#F00', fillColor: '#F00' });
        props.debugmap.drawElipse({
            x,
            y,
            radius: size,
            color: '#F00',
            fillColor: '#F00',
        });
    };
    // Render the player
    const render = (keyCodes) => {
        handleKeyUp(keyCodes);
        drawPlayerBody();
        applyGravity();
        crouch();
    };
    // Render everything that needs to render after everything finished render
    const postRender = () => {
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        // Player sprite
        const { gun } = config.player;
        props.screen.drawImage({
            x: centerX - gun.width / 2,
            y: canvasHeight - gun.height,
            image: gun.image,
            width: gun.width,
            height: gun.height,
        });
        // Player crosshair
        const { crosshair } = config.player;
        props.screen.drawImage({
            x: centerX - crosshair.width / 2,
            y: centerY - crosshair.height / 2,
            image: crosshair.image,
            width: crosshair.width,
            height: crosshair.height,
        });
    };
    // Return all public functions
    return {
        render,
        postRender,
        get,
    };
};
exports.default = Player;

},{"../../config/config":1}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("../../../config/config");
const RayCasting = (scenario, player, canvasMinimap, canvasMiniMapDebug, canvasScreen, textures) => {
    const { map, tilesX, tilesY, tileSize, screen: { sky }, } = scenario;
    const props = {
        fov: player.get('fov'),
        zIndex: [],
        podDistance: 0,
    };
    const canvasWidth = canvasScreen.getConfig('width');
    const canvasHeight = canvasScreen.getConfig('height');
    let objects = [];
    // # Enviroment - - - - - - - - - - - - - - - - - - - - - - - -
    const drawFloor = (x, y) => {
        const gradient = canvasScreen.createLineGradient('#222', '#555');
        canvasScreen.drawRectangle({
            x,
            y,
            width: 1,
            height: canvasHeight - y,
            color: gradient,
        });
    };
    const renderSky = () => {
        if (!window.global.renderTextures)
            return;
        const jump = player.get('jump');
        const pod = player.get('pod');
        const look = player.get('look');
        // Draw two images side by side.
        // When one reaches the end of screen, reset position
        // This will make the effect of an infinite skybox
        canvasScreen.drawImage({
            image: sky.image,
            clipX: (sky.width / (6 * 60)) * pod,
            clipY: 0,
            clipWidth: sky.width,
            clipHeight: sky.height * 3,
            x: 0,
            y: -sky.height + look,
            width: canvasWidth,
            height: (canvasHeight + jump / 10) * 3,
        });
        canvasScreen.drawImage({
            image: sky.image,
            clipX: (sky.width / (6 * 60)) * (pod - 360),
            clipY: 0,
            clipWidth: sky.width,
            clipHeight: sky.height * 3,
            x: 0,
            y: -sky.height + look,
            width: canvasWidth,
            height: (canvasHeight + jump / 10) * 3,
        });
    };
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // # Objects - - - - - - - - - - - - - - - - - - - - - - - - -
    const getAllObjectsCoordinates = () => {
        new Array(tilesY).fill('').forEach((_, y) => {
            new Array(tilesX).fill('').forEach((_, x) => {
                const x0 = x * tileSize;
                const y0 = y * tileSize;
                const objectTexture = textures.get(map[y][x]);
                if (objectTexture.isObject)
                    objects.push({
                        texture: objectTexture,
                        x: x0,
                        y: y0,
                    });
            });
        });
    };
    const drawObject = (object, left) => {
        if (!object)
            return;
        if (!window.global.renderTextures)
            return;
        const { size, distance, props: { texture }, } = object;
        const textureWidth = tileSize;
        const textureHeight = tileSize;
        // "shadow"
        const { maxDistanceVisible } = config.game.render;
        let alpha = (maxDistanceVisible * 0.2) / distance;
        if (alpha > 1)
            alpha = 1; // avoid max brightness
        // Loop each pixel of texture to draw
        new Array(textureWidth).fill('').forEach((_, i) => {
            const pixel = size / textureWidth;
            const x = pixel * i + left;
            const jump = (player.get('jump') * 10) / distance;
            const y = (canvasHeight - size) / 2 + player.get('look') + jump;
            // Don't render sprites behind walls
            if (props.zIndex[Math.round(x)] < distance)
                return;
            const drawProps = {
                image: texture.image,
                clipX: i,
                clipY: 0,
                clipWidth: 1,
                clipHeight: textureHeight,
                x,
                y,
                width: pixel,
                height: size,
            };
            // Apply filter if it's not a light
            if (!texture.isLight) {
                drawProps.filter = `brightness(${alpha})`;
            }
            canvasScreen.drawImage(drawProps);
        });
    };
    const renderObjects = () => {
        const objectsToDraw = [];
        const pod = player.get('pod');
        const fov = player.get('fov');
        const playerX = player.get('x');
        const playerY = player.get('y');
        // Loop all objetcs on scenario
        objects.map((object) => {
            const dx = (object.x + tileSize / 2 - playerX) / tileSize;
            const dy = (object.y + tileSize / 2 - playerY) / tileSize;
            let angle = Math.atan2(dy, dx) - pod * (Math.PI / 180);
            if (angle < -Math.PI) {
                angle += 2 * Math.PI;
            }
            if (angle >= Math.PI) {
                angle -= 2 * Math.PI;
            }
            // Check if object is inside angle of view
            if (angle > -Math.PI * 0.5 && angle < Math.PI * 0.5) {
                const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
                const viewDist = canvasWidth / Math.tan(fov / 2);
                const size = config.game.render.wallHeight / (Math.cos(angle) * distance);
                // Add it to draw array
                objectsToDraw.push({
                    distance: distance,
                    angle: angle,
                    viewDist: viewDist,
                    size: size,
                    props: object,
                });
            }
        });
        // Sort objects and render from farther to closer
        objectsToDraw.sort(function (a, b) {
            if (a.distance < b.distance)
                return 1;
            if (a.distance > b.distance)
                return -1;
            return 0;
        });
        // Now loop the objects and draw
        objectsToDraw.map((object) => {
            const x = Math.tan(object.angle) * object.viewDist;
            const left = canvasWidth / 2 + x - object.size / 2;
            drawObject(object, left);
        });
    };
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // # Wall - - - - - - - - - - - - - - - - - - - - - - - - - - -
    const drawWall = (x, wall, debugSingleRay) => {
        // Wall props
        let size = config.game.render.wallHeight / wall.distance;
        let texture = textures.get(wall.texture);
        let textureX = Math.floor((tileSize / tileSize) * wall.textureX);
        // Check if player is jumping and adjust wall Y
        let jump = (player.get('jump') * 10) / wall.distance;
        let y = canvasHeight / 2 - size / 2 + player.get('look') + jump;
        // Draw
        if (window.global.renderTextures) {
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
        }
        else {
            canvasScreen.drawRectangle({
                color: '#00F',
                x,
                y,
                width: 1,
                height: size,
            });
        }
        // Shadow
        if (wall.shadow) {
            canvasScreen.drawRectangle({
                x,
                y,
                width: 1,
                height: size,
                color: 'rgba(0,0,0,0.2)',
            });
        }
        // "light"
        const { maxDistanceVisible } = config.game.render;
        const alpha = wall.distance / maxDistanceVisible;
        canvasScreen.drawRectangle({
            x,
            y,
            width: 1,
            height: size,
            color: `rgba(0,0,0,${alpha})`,
        });
        // debug de ray fo center
        if (debugSingleRay) {
            canvasMiniMapDebug.drawLine({
                x: player.get('x'),
                y: player.get('y'),
                toX: wall.rayX,
                toY: wall.rayY,
                color: '#F00',
            });
        }
        drawFloor(x, y + size);
    };
    const castWallRay = (angle) => {
        // Angle correction
        const PI2 = Math.PI * 2;
        angle %= PI2;
        if (angle < 0) {
            angle += PI2;
        }
        // Initial values
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
            const object = textures.get(map[wallY][wallX]);
            // Hitted a floor?
            if (object && object.isWall) {
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
            const object = textures.get(map[wallY][wallX]);
            if (object && object.isWall) {
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
            rayX: toX,
            rayY: toY,
        };
    };
    const renderWalls = () => {
        props.zIndex = [];
        const pod = player.get('pod');
        // Set base resolution according to canvas width
        let rayQuantity = Math.ceil(canvasWidth);
        // For each resolution, cast a wall
        for (let x = 0; x < rayQuantity; x++) {
            let debugSingleRay = false;
            let viewDist = canvasWidth / Math.tan(props.fov / 2);
            let rayx = -rayQuantity / 2 + x;
            let rayDist = Math.sqrt(rayx * rayx + viewDist * viewDist);
            let rayAngle = Math.asin(rayx / rayDist);
            let wall = castWallRay(pod * (Math.PI / 180) + rayAngle);
            if (x === rayQuantity / 2) {
                debugSingleRay = true;
                props.podDistance = wall.distance;
            }
            drawWall(x, wall, debugSingleRay);
        }
    };
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Setup
    const setup = () => {
        getAllObjectsCoordinates();
    };
    // Render everything
    const render = () => {
        renderSky();
        renderWalls();
        renderObjects();
    };
    return {
        setup,
        render,
    };
};
exports.default = RayCasting;

},{"../../../config/config":1}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RayCasting_1 = require("./RayCasting");
const Scenario = (player, canvasMiniMap, canvasMiniMapDebug, canvasScreen, config, textures) => {
    const { tileSize, tilesX, tilesY, map } = config;
    const getConfig = (prop) => {
        return config[prop];
    };
    const getConfigs = () => {
        return config;
    };
    const rayCasting = RayCasting_1.default(config, player, canvasMiniMap, canvasMiniMapDebug, canvasScreen, textures);
    rayCasting.setup();
    // Tiles
    const renderMiniMaps = () => {
        // Loop tiles
        new Array(tilesY).fill('').forEach((_, y) => {
            new Array(tilesX).fill('').forEach((_, x) => {
                const x0 = x * tileSize;
                const y0 = y * tileSize;
                const objectTexture = textures.get(map[y][x]);
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
            });
        });
    };
    // Ray Casting
    const renderScreen = () => {
        canvasScreen.render();
        rayCasting.render();
    };
    // Render
    const render = () => {
        canvasMiniMap.render();
        canvasMiniMapDebug.render();
        renderMiniMaps();
        renderScreen();
    };
    // Return all public functions
    return {
        render,
        getConfig,
        getConfigs,
    };
};
exports.default = Scenario;

},{"./RayCasting":7}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Canvas_1 = require("../Canvas");
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

},{"../Canvas":4}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const textures_1 = require("../../config/textures");
function Textures() {
    let textures = [];
    // Preload textures
    const preload = () => {
        Object.keys(textures_1.default).forEach((key) => {
            const img = new Image();
            img.src = textures_1.default[key].image;
            textures.push({
                id: key,
                image: img,
                isWall: textures_1.default[key].isWall,
                isObject: textures_1.default[key].isObject,
                isCollidable: textures_1.default[key].isCollidable,
                isLight: textures_1.default[key].isLight,
            });
        });
    };
    preload();
    const get = (id) => {
        const r = textures.find((o) => o.id === id);
        return r;
    };
    return { get };
}
exports.default = Textures;

},{"../../config/textures":3}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line
const Stats = require('stats.js'); // This "require" is necessary for Stats JS to work with Typescript
const Screen_1 = require("./Screen");
const MiniMap_1 = require("./MiniMap");
const Player_1 = require("./Player");
const Textures_1 = require("./Textures");
const Scenario_1 = require("./Scenario");
const config = require("../config/config");
const Game = () => {
    // FPS Status
    const FPSstats = new Stats();
    FPSstats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(FPSstats.dom);
    // Game Objects
    const textures = Textures_1.default();
    const screen = new Screen_1.default(config.screen);
    const minimap = new MiniMap_1.default(config.miniMapAllRays);
    const minimap_singleRay = new MiniMap_1.default(config.miniMapSingleRay);
    const configScenario = config.scenario;
    const player = Player_1.default(minimap, minimap_singleRay, screen, textures, configScenario);
    const scenario = Scenario_1.default(player, minimap, minimap_singleRay, screen, configScenario, textures);
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
        player.postRender();
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

},{"../config/config":1,"./MiniMap":5,"./Player":6,"./Scenario":8,"./Screen":9,"./Textures":10,"stats.js":13}],12:[function(require,module,exports){
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
// stats.js - http://github.com/mrdoob/stats.js
(function(f,e){"object"===typeof exports&&"undefined"!==typeof module?module.exports=e():"function"===typeof define&&define.amd?define(e):f.Stats=e()})(this,function(){var f=function(){function e(a){c.appendChild(a.dom);return a}function u(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();
u(++l%c.children.length)},!1);var k=(performance||Date).now(),g=k,a=0,r=e(new f.Panel("FPS","#0ff","#002")),h=e(new f.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var t=e(new f.Panel("MB","#f08","#201"));u(0);return{REVISION:16,dom:c,addPanel:e,showPanel:u,begin:function(){k=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();h.update(c-k,200);if(c>g+1E3&&(r.update(1E3*a/(c-g),100),g=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/
1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){k=this.end()},domElement:c,setMode:u}};f.Panel=function(e,f,l){var c=Infinity,k=0,g=Math.round,a=g(window.devicePixelRatio||1),r=80*a,h=48*a,t=3*a,v=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=h;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,h);b.fillStyle=f;b.fillText(e,t,v);
b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(h,w){c=Math.min(c,h);k=Math.max(k,h);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=f;b.fillText(g(h)+" "+e+" ("+g(c)+"-"+g(k)+")",t,v);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,g((1-h/w)*p))}}};return f});

},{}]},{},[12]);
