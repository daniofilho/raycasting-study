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
    // Draw a rectangle on canvas
    drawRect(x, y, width, height, color) {
        let ctx = this.context;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
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
}
exports.default = Canvas;
