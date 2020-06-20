(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Canvas = /** @class */ (function () {
    function Canvas(canvasID) {
        var canvas = document.getElementById(canvasID);
        var context = canvas.getContext('2d');
        //this.canvas = canvas;
        this.context = context;
    }
    Canvas.prototype.drawRect = function (x, y, width, height) {
        var context = this.context;
        context.fillRect(x, y, width, height);
        context.clearRect(x, y, width, height);
        context.strokeRect(x, y, width, height);
    };
    return Canvas;
}());
exports.default = Canvas;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Canvas_1 = require("./engine/Canvas");
var MyCanvas = new Canvas_1.default('screen');
MyCanvas.drawRect(0, 0, 100, 100);

},{"./engine/Canvas":1}]},{},[2]);
