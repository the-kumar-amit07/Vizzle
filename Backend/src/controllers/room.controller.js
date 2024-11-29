import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { Room } from "../models/room.model.js";


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

    return res
        .status(201)
        .json(ApiResponse(room, "Room created successfully!"));
});

//---> joinRoom
const joinRoom = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const userId = req.user._id;
    if (!roomId) {
        throw new ApiErrors(400, "Room ID is required!");
    }

    const room = await Room.findById(roomId);
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
    const room = await Room.findById(roomId).populate("participants", "userName avatar")
    if (!room) {
        throw new ApiErrors(404, "Room not found.")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, room, "Room info fetched successfully."));
})



export {
    createRoom,
    joinRoom,
    getRoomInfo
}