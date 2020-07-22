"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = require("./engine");
window.global = {
    renderTextures: true,
};
// Start the engine
const engine = engine_1.default();
engine.startGame();
//# sourceMappingURL=main.js.map