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
