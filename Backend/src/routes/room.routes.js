import { Router } from "express";
import { varifyJWT } from "../middlewares/auth.middleware.js";
import { createRoom, getRoomInfo, joinRoom } from "../controllers/room.controller.js";

const router = Router();

router.route("/create", varifyJWT, createRoom);
router.route("/:roomId/join", varifyJWT, joinRoom);
router.route("/:roomId", varifyJWT, getRoomInfo)

export default router;