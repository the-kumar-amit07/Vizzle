import { Router } from "express";
import { varifyJWT } from "../middlewares/auth.middleware.js";
import { createRoom, getInviteLink, getRoomInfo, joinRoom } from "../controllers/room.controller.js";

const router = Router();

router.route("/create-room").post(varifyJWT, createRoom);
router.route("/join/:inviteToken").post(varifyJWT, joinRoom);
router.route("/:roomId").get(varifyJWT, getRoomInfo)
router.route("/:roomId/invite").get(varifyJWT, getInviteLink)

export default router;