import { Router } from "express";
import {
    createRoom,
    getInviteLink,
    getRoomInfo,
    joinRoom,
} from "../controllers/room.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-room").post(verifyJWT, createRoom);
router.route("/join/:inviteToken").post(verifyJWT, joinRoom);
router.route("/:roomId").get(verifyJWT, getRoomInfo);
router.route("/:roomId/invite").get(verifyJWT, getInviteLink);

export default router;
