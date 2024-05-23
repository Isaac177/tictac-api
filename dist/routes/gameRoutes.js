"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gameController_1 = require("../controllers/gameController");
const router = (0, express_1.Router)();
router.post('/games', gameController_1.createGame);
router.get('/games/:id', gameController_1.getGameById);
exports.default = router;
