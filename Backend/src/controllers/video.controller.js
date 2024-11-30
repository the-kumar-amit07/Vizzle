import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { deleteFromCloudinary, extractPublicIdFromUrl, uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

//--->uploadVideo
const uploadVideo = asyncHandler(async (req,res) => {
    const { title, description, isPublished, duration } = req.body;
    // console.log("req.body",req.body);
    
    if ([title, description, duration].some((field) => field?.trim() === "")) {
        throw new ApiErrors.Error(400,"Title, description, and duration are required!");
    }
    const videoFilePath = req.files?.videoFile[0]?.path;
    const thumbnailFilePath = req.files?.thumbnail[0]?.path;
    if (!videoFilePath || !thumbnailFilePath) {
        throw new ApiErrors.Error(400,"Video file and thumbnail are required!")
    }
    const videoFile = await uploadOnCloudinary(videoFilePath)
    const thumbnail = await uploadOnCloudinary(thumbnailFilePath)

    // console.log("video file path::",videoFilePath);

    if (!videoFile?.url || !thumbnail?.url) {
        throw new ApiErrors.Error(500, "Failed to upload video or thumbnail!")
    }
    const video = await Video.create({
        videoFile:videoFile.url,
        thumbnail:thumbnail.url,
        title,
        description,
        duration,
        isPublished : isPublished || true,
        owner : req.user._id,
        
    })

    return res
        .status(201)
        .json(new ApiResponse(201, video, "Video uploaded successfully."));
})

//-->getAllVideos
const getAllVideos = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        query = "",
        sortBy = "createdAt",
        sortType = "desc",
        userId
    } = req.query

    const pageNum = parseInt(page, 10)
    const limitNum = parseInt(limit, 10)
    
    const sortOrder = sortType === "asc" ? 1 : -1;
    const sortOption = { [sortBy]: sortOrder }
    
    const publishStatus = { isPublished: true }
    // Filter by title (search query)
    if (query?.trim()) {
        publishStatus.title = {$regex: query, $options: "i"} // Case-insensitive search
    }

    if (userId) {
        publishStatus.owner = new mongoose.Types.ObjectId(userId)
    }

    const video = await Video.aggregate([
        {
            $match: publishStatus
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            },
        },
        {
            $unwind: "$owner"
        },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                views: 1,
                thumbnail: 1,
                duration: 1,
                createdAt: 1,
                "owner.userName": 1,
                "owner.avatar": 1,
            },
        },
        {
            $sort: sortOption, // Sort the videos
        },
        {
            $skip: (pageNum - 1) * limitNum, // Skip videos for pagination
        },
        {
            $limit: limitNum,  // limit the number of videos
        }
    ]);

    const totalVideos = await Video.countDocuments(publishStatus);

    const response = {
        video,
        currentPage: pageNum,
        totalPage: Math.ceil(totalVideos / limitNum),
        totalVideos,
    }

    return res
        .status(200)
        .json(new ApiResponse(200, response, "Videos fetched successfully."));
})

//--->getVideoById
const getVideoById = asyncHandler(async (req,res) => {
    const { id } = req.params
    if (!id?.trim()) {
        throw new ApiErrors(400, "Video ID is required.");
    }

    const video = await Video.findById(id).populate("owner userName avatar")
    if (!video) {
        throw new ApiErrors(404, "Video not found.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video fetched successfully."));
})

//--->updateVideo
const updateVideo = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { title, description } = req.body
    
    const video = await Video.findByIdAndUpdate(
        id,
        {
            $set : {title,description}
        },
        {new : true}
    )
    if (!video) {
        throw new ApiErrors(404, "Video not found!");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video updated successfully!"));
})

//--->deleteVideo
const deleteVideo = asyncHandler(async (req,res) => {
    const { id } = req.params
    const video = await Video.findById(id)
    if (!video) {
        throw new ApiErrors(404, "Video not found!");
    }
    if (video.url) {
        const publicId = await extractPublicIdFromUrl(video.url)
        if (publicId) {
            await deleteFromCloudinary(publicId) //if  not work then put this { resource_type: "video" }
        }
    }
    await video.deleteOne()
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Video deleted successfully!"));
})


export {
    uploadVideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
}