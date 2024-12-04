import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { Room } from "../models/room.model.js";
import mongoose from "mongoose";

const BASE_URL = process.env.CORS_ORIGIN || "http://localhost:5173"; //update according to your deployment

//--->createRoom
const createRoom = asyncHandler(async (req,res) => {
    const { videoId, title } = req.body;
    const userId = req.userId;

    if (!videoId || !title) {
        throw new ApiErrors(400, "Video ID and Room Title are required!");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiErrors(404, "Video not found.");
    }

    const room = await Room.create({
        videoId,
        title,
        host: userId,
        participants:[userId]
    })

    const inviteLink = `${BASE_URL}/room/join/${room.inviteToken}`;

    return res
        .status(201)
        .json(ApiResponse(201,{room,inviteLink}, "Room created successfully!"));
});

//---> joinRoom
const joinRoom = asyncHandler(async (req, res) => {
    const { inviteToken } = req.params;
    const userId = req.user._id;
    if (!inviteToken) {
        throw new ApiErrors(400, "Room ID is required!");
    }

    const room = await Room.findOne(inviteToken);
    if (!room) {
        throw new ApiErrors(400, "Room not Found.");
    }
    
    if (!room.isActive) {
        throw new ApiErrors(400, "This room is no longer active.");
    }

    if (!room.participants.includes(userId)) {
        room.participants.push(userId);
        await room.save();
    }
    return res
        .status(200)
        .json(new ApiResponse(200, room, "Joined the room successfully."));
})

//getRoomInfo
const getRoomInfo = asyncHandler(async (req, res) => { 
    const { roomId } = req.params;
    if (!roomId) {
        throw new ApiErrors(400, "Room ID is required!");
    }
    // const room = await Room.findById(roomId).populate("participants", "userName avatar")
    // if (!room) {
    //     throw new ApiErrors(404, "Room not found.")
    // }

    const room = await Room.aggregate([
        {
            $match:{_id: new mongoose.Types.ObjectId(roomId)}
        },
        {
            $lookup: {
                from: "users",
                localField: "participants",
                foreignField: "_id",
                as: "participants"
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videoId",
                foreignField: "_id",
                as: "video"
            }
        },
        { $unwind: "video" },
        {
            $project: {
                _id: 1,
                title: 1,
                isActive: 1,
                createdAt: 1,
                "video.title": 1,
                "video.thumbnail": 1,
                "video.duration": 1,
                "participants.userName": 1,
                "participants.avatar": 1,
            } 
        }
    ])

    if (!room?.length) {
        throw new ApiErrors(404, "Room not found.");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, room[0], "Room info fetched successfully."));
})

//getInviteLink (existing room link)
const getInviteLink = asyncHandler(async (req, res) => {
    const { inviteToken } = req.params;
    if (!inviteToken) {
        throw new ApiErrors(400,"Room ID is required!")
    }

    const room = await Room.findOne(inviteToken);
    if (!room) {
        throw new ApiErrors(404, "Room not found.");
    }

    const inviteLink = `${BASE_URL}/room/join/${room.inviteToken}`;

    return res
        .status(200)
        .json(new ApiResponse(200, inviteLink, "Invite link generated successfully."));
})



export {
    createRoom,
    joinRoom,
    getRoomInfo,
    getInviteLink,
}