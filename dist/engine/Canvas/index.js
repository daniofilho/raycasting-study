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
    // Draw a text
    const drawText = ({ text, x, y, color = '#000', size = 20, align = 'left' }) => {
        context.font = `${size}px Arial`;
        context.fillStyle = color;
        context.textAlign = align;
        context.fillText(text, x, y);
    };
    // Draw a rectangle on canvas
    const drawRectangle = ({ x, y, width, height, color }) => {
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
    };
    // Draw a line on canvas
    const drawLine = ({ x, y, toX, toY, color }) => {
        context.strokeStyle = color;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(toX, toY);
        context.stroke();
    };
    // Draw a circle on canvas
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
