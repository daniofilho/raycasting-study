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
            this.context.restore();
            context.font = `${size}px Arial`;
            context.fillStyle = color;
            context.textAlign = align;
            context.fillText(text, x, y);
            return context;
        };
        // Draw a rectangle on canvas
        this.drawRectangle = ({ x, y, width, height, color }) => {
            const { context } = this;
            this.context.restore();
            context.fillStyle = color;
            context.fillRect(x, y, width, height);
            return context;
        };
        // Draw a line on canvas
        this.drawLine = ({ x, y, toX, toY, color }) => {
            const { context } = this;
            this.context.restore();
            context.strokeStyle = color;
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(toX, toY);
            context.stroke();
            return context;
        };
        // Draw a circle on canvas
        this.drawElipse = ({ x, y, radius, color = '#FFF', fillColor = 'rgba(0,0,0,0)' }) => {
            const { context } = this;
            this.context.restore();
            context.strokeStyle = color;
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI);
            context.fillStyle = fillColor;
            context.fill();
            context.stroke();
            return context;
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
            this.context.restore();
            this.context.imageSmoothingEnabled = false; // Pixelate image
            // Will draw with filter?
            if (filter)
                this.context.filter = filter;
            this.doDrawImage(params);
            // Reset filter
            if (filter)
                this.context.filter = 'none';
            return this.context;
        };
        this.canvas = document.getElementById(config.canvasID);
        this.context = this.canvas.getContext('2d');
        this.config = config;
    }
}
exports.default = Canvas;
//# sourceMappingURL=index.js.map