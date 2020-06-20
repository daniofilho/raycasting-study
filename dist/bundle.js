(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.player = exports.canvas = void 0;
exports.canvas = {
    backgroundColor: '#333333',
    width: 800,
    height: 600,
};
exports.player = {
    x: 400,
    y: 300,
    width: 50,
    height: 50,
    color: '#FFFF00',
};

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("../../config");
class Canvas {
    constructor(canvasID) {
        let canvas = document.getElementById(canvasID);
        let context = canvas.getContext('2d');
        this.canvas = canvas;
        this.context = context;
        this.run();
    }
    // Initialize class
    run() {
        const { width, height, backgroundColor } = config.canvas;
        // Canvas Size
        let canvas = this.canvas;
        canvas.width = width;
        canvas.height = height;
        // Canvas Background color
        this.drawRect(0, 0, width, height, backgroundColor);
    }
    // Draw a rectangle on canvas
    drawRect(x, y, width, height, color) {
        let context = this.context;
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
        context.clearRect(x, y, width, height);
        context.strokeRect(x, y, width, height);
    }
}
exports.default = Canvas;

},{"../../config":1}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Canvas_1 = require("./engine/Canvas");
// Declarations
const MyCanvas = new Canvas_1.default('screen');
/*
// Init
const drawPlayer = (x: number, y: number) => {
  const { width, height, color } = config.player;
  MyCanvas.drawRect(x, y, width, height, color);
};
drawPlayer(config.player.x, config.player.y);*/

},{"./engine/Canvas":2}]},{},[3]);
