import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiErrors} from "../utils/ApiErrors.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const generateRefreshAndAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : true})
        return {refreshToken, accessToken}
    } catch (error) {
        throw new ApiErrors(500,"Something went wrong while generating refresh and access token !");
    }
}

//---->registerUser
const registerUser = asyncHandler(async (req, res) => {
    //get details from user
    const { fullName, email, userName, password } = req.body
    //check if user already exists
    // console.log("user email:", email);

    //--> validation for field to check it's empty or not 
    if ([fullName,email,userName,password].some((field) => field?.trim() === ""))  {
        throw new ApiErrors (400,"All fields are required !");
    }

    //-->check the user already exist or not
    const existingUser = await User.findOne({
        $or:[{userName},{email}]
    })

    if (existingUser) {
        throw new ApiErrors(409,"User already exist !");   
    }
    //check files are available or not
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if (req.files && req.files.coverImage.length > 0 && Array.isArray(req.files.coverImage)) {
        coverImageLocalPath = req.files.coverImage[0].path
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

    //-->create new-user in database
    const user = await User.create({
        fullName,
        email,
        userName : userName.toLowerCase(),
        password,
        avatar:avatar.url,
        coverImage:coverImage?.url || ""
    })
    //-->check registration successful or not
    const checkedUser = await User.findById(user._id).select("-password -refreshToken") //without password and refreshToken
    if (!checkedUser) {
        throw new ApiErrors(500,"Failed to register user");
    }

    //response to user
    return res.status(201).json(
        new ApiResponse(200,checkedUser,"User registered successful !")
    )
})

//---->logInUser
const logInUser = asyncHandler(async (req,res) => {
    const { userName, email, password } = req.body

    if (!userName || !email) {
        throw new ApiErrors(400,`${!userName?'username required' : 'email required'}`)
    }
    //-->check user exist or not
    const user = await User.findOne({
        $or: [{ email }, { userName }]
    })
    if (!user) {
        throw new ApiErrors(404,"user does not exist !")
    }
    //-->check user password
    const isValidPassword = await user.comparePassword(password)
    if (!isValidPassword) {
        throw new ApiErrors(401,"Invalid password !")
    }
    //generate accessToken and refreshToken
    const { accessToken, refreshToken } = await generateRefreshAndAccessToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    //set the cookie
    const options = {
        httpOnly: true,
        secure: true,
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
        httpOnly: true,
        secure: true,
    }
    //response to user
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully !"))
})

export {
    registerUser,
    logInUser,
    logOutUser
}