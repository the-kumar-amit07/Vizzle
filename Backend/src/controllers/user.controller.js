import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiErrors} from "../utils/ApiErrors.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary, deleteFromCloudinary,extractPublicIdFromUrl } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";
import mongoose from "mongoose"


const generateRefreshAndAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
        return {accessToken,refreshToken }
    } catch (error) {
        throw new ApiErrors(500,"Something went wrong while generating refresh and access token!");
    }
}

//---->registerUser
const registerUser = asyncHandler(async (req, res) => {
    //get details from user
    const { fullName, email, userName, password } = req.body
    //check if user already exists
    // console.log("user email:", email);

    // validation for field to check it's empty or not 
    if ([fullName,email,userName,password].some((field) => field?.trim() === ""))  {
        throw new ApiErrors (400,"All fields are required!");
    }

    //check the user already exist or not
    const existingUser = await User.findOne({
        $or:[{userName},{email}]
    })

    if (existingUser) {
        throw new ApiErrors(409,"User already exist!");   
    }
    //check files are available or not
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0 ) {
        coverImageLocalPath = req.files.coverImage[0]?.path
    }

    console.log("avatar local path:", avatarLocalPath,)

    if (!avatarLocalPath) {
        throw new ApiErrors(400,"avatar file is required");
    }
    //if file available uploaded into cloudinary Server
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiErrors(400,"avatar required");
    }

    //create new-user in database
    const user = await User.create({
        fullName,
        email,
        userName : userName.toLowerCase(),
        password,
        avatar:avatar.url,
        coverImage:coverImage?.url || ""
    })
    //check registration successful or not
    const checkedUser = await User.findById(user._id).select("-password -refreshToken") //without password and refreshToken
    if (!checkedUser) {
        throw new ApiErrors(500,"Failed to register user");
    }

    //response to user
    return res.status(201).json(
        new ApiResponse(200,checkedUser,"User registered successful!")
    )
})

//---->logInUser
const logInUser = asyncHandler(async (req,res) => {
    const { userName, email, password } = req.body

    if (!(userName || email)) {
        throw new ApiErrors(400,`${!userName?'username required' : 'email required'}`)
    }
    //-->check user exist or not
    const user = await User.findOne({
        $or: [{ email }, { userName }]
    })
    if (!user) {
        throw new ApiErrors(404,"user does not exist!")
    }
    //-->check user password
    const isValidPassword = await user.comparePassword(password)
    if (!isValidPassword) {
        throw new ApiErrors(401,"Invalid password!")
    }
    //generate accessToken and refreshToken
    const { accessToken, refreshToken } = await generateRefreshAndAccessToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    //set the cookie
    const options = {
        httpOnly: true,               // Prevent JavaScript access
        secure: false,                // Not using HTTPS in development
        sameSite: 'Lax',              // Allow some cross-origin requests for testing
        // maxAge: 3600000,              // 1 hour expiration
        path: '/',
    }
    //response to user
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200,
            {
                user: loggedInUser,accessToken,refreshToken
            },
                "User logged in successfully !"
            )
        )
})

//---->logOutUser
const logOutUser = asyncHandler(async (req, res) => { 
    await User.findByIdAndUpdate(req.user._id,
        {
            $unset : {refreshToken : 1} //removes the field from document
        }, {
            new : true
    })
    //set the cookie
    const options = {
        httpOnly: true,               // Prevent JavaScript access
        secure: false,                // Not using HTTPS in development
        sameSite: 'Lax',              // Allow some cross-origin requests for testing
        // maxAge: 3600000,              // 1 hour expiration
        path: '/',
    }
    //response to user
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully !"))
})

//--->refreshAccessToken
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiErrors(401,"Unauthorized request...!")
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiErrors(401,"Invalid refreshToken !")
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiErrors(401, "Refresh Token Expired !");
        }

          //set the cookie
        const options = {
            httpOnly: true,               // Prevent JavaScript access
            secure: false,                // Not using HTTPS in development
            sameSite: 'Lax',              // Allow some cross-origin requests for testing
            // maxAge: 3600000,              // 1 hour expiration
            path: '/',
        }
        
        const { accessToken, newRefreshToken } = await generateRefreshAndAccessToken(user._id)
        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(200, {
                    accessToken,
                    refreshToken: newRefreshToken,
                }, "Access Token Refreshed Successfully !")
            )
    } catch (error) {
        throw new ApiErrors(401, error?.message || "Invalid Refresh Token !");
    }
})

//--->changePassword
const changePassword = asyncHandler(async (req,res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)
    const checkPassword = await user.comparePassword(oldPassword)

    if (!checkPassword) {
        throw new ApiErrors(400,"Invalid Password !")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })
    
    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Password Changed Successfully !")
        )
})

//--->getCurrentUser
const getCurrentUser = asyncHandler(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,req.user, "User Retrieved successfully."),
    )
})

//--->updateAccountDetails
const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body
    if (!(fullName || email)) {
        throw new ApiErrors(400,"All fields are required!")
    }
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { fullName, email } },
        {new : true}
    ).select("-password")
    return res
        .status(200)
        .json(new ApiResponse(200,user,"Account Details Updated Successfully."))
})

//--->updateAvatar
const updateAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        throw new ApiErrors(400,"Avatar is missing!")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar.url) {
        throw new ApiErrors(400,"Error while uploading a avatar!")
    }

    const user = await User.findById(req.user._id)
    if (!user) {
        throw new ApiErrors(404,"User not found!")
    }

    if (user.avatar) {
        const publicId = await extractPublicIdFromUrl(user.avatar)
        if (publicId) {
            await deleteFromCloudinary(publicId)
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { avatar: avatar.url } },
        {new : true}
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200,updatedUser,"Avatar Updated Successfully."))
})

//--->updateCoverImage
const updateCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path
    if (!coverImageLocalPath) {
        throw new ApiErrors(400,"Cover Image is missing!")
    }
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiErrors(400,"Error while uploading a coverImage")
    }

    const user = await User.findById(req.user._id)
    if (!user) {
        throw new ApiErrors(404,"User not found!")
    }

    if (user.coverImage) {
        const publicId = await extractPublicIdFromUrl(user.coverImage)
        if (publicId) {
            await deleteFromCloudinary(publicId)
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {$set:{coverImage:coverImage.url}},
        {new : true}
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200,updatedUser,"CoverImage Updated Successfully."))
})

//--->getChannel
const getChannel = asyncHandler(async (req, res) => {
    const { userName } = req.params
    if (!userName?.trim()) {
        throw new ApiErrors(400,"Username missing!")
    }

    const channel = await User.aggregate([
        {
            $match:{userName:userName.toLowerCase()}
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribed"
            }
        },
        {
            $addFields: {
                subscriberCount: { $size: "$subscribers" },
                subscribedCount: { $size: "$subscribed" },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                },
            }
        },
        {
            $project: {
                fullName: 1,
                userName: 1,
                email: 1,
                subscriberCount: 1,
                subscribedCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
            }
        }
    ])

    if (!channel?.length) {
        throw new ApiErrors(404,"Channel does not exist!");
    }


    return res
        .status(200)
        .json(new ApiResponse(200,channel[0],"Channel Found"))
})

//--->getWatchHistory
const getWatchHistory = asyncHandler(async (req, res) => { 
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id),
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as:"owner",
                            pipeline: [{
                                $project: {
                                    fullName: 1,
                                    userName: 1,
                                    avatar:1,
                                }
                            }]
                        }
                    }, {
                        $addFields: {
                            owner: {
                                $first : "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])
    
    console.log("watchHistory",user[0].watchHistory);
    

    if (!user?.length) {
        throw new ApiErrors(404,"user does not exist!");
    }

    return res
        .status(200)
        .json(new ApiResponse(200,user[0].watchHistory,"Watch History"))
})

//searchedByUser
const searchedByUser = asyncHandler(async (req, res) => {
    const { query } = req.query;
    if (!query?.trim()) {
        throw new ApiErrors("Search query is required!");
    }

    const user = await User.aggregate([
        {
            $match: {
                userName: { $regex: query, $options: "i" }
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers",
            }
        },
        {
            $addFields: {
                subscriberCount: { $size: "$subscribers" }
            }
        },
        {
            $project: {
                fullName: 1,
                userName: 1,
                avatar: 1,
                coverImage: 1,
                subscriberCount: 1,
            }
        }
    ]);

    if (!user.length) {
        return res.status(200).json(new ApiResponse(200, [], "No users found"));
    }

    return res.status(200).json(new ApiResponse(200, user, "Users retrieved successfully!"));
});

    

export {
    registerUser,
    logInUser,
    logOutUser,
    refreshAccessToken,
    changePassword,
    getCurrentUser,
    updateAccountDetails,
    updateAvatar,
    updateCoverImage,
    getChannel,
    getWatchHistory,
    searchedByUser
}