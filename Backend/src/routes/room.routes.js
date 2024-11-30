import { Router } from "express";
import { varifyJWT } from "../middlewares/auth.middleware.js";
import { createRoom, getRoomInfo, joinRoom } from "../controllers/room.controller.js";

const router = Router();

router.route("/create").post(varifyJWT, createRoom);
router.route("/:roomId/join").post(varifyJWT, joinRoom);
router.route("/:roomId").get(varifyJWT, getRoomInfo)

export default router;