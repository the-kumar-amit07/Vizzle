import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiErrors} from "../utils/ApiErrors.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import {ApiResponce} from "../utils/ApiResponce.js"

const registerUser = asyncHandler(async (req, res) => {
    //get details from user
    const { fullName, email, userName, password } = req.body
    //check if user already exists
    console.log("user email:", email);

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

    //-->create new user in database
    const user = await User.create({
        fullName,
        email,
        userName : userName.toLowerCase(),
        password,
        avatar:avatar.url,
        coverImage:coverImage?.url || ""
    })
    //-->check registeration successfull or not
    const checkedUser = await User.findById(user._id).select("-password -refreshToken") //without password and refreshToken
    if (!checkedUser) {
        throw new ApiErrors(500,"Failed to register user");
    }

    //responce to user
    return res.status(201).json(
        new ApiResponce(200,checkedUser,"User registered successfull !")
    )
})

const logInUser = asyncHandler(async (req,res) => {
    
})

export {
    registerUser,
    logInUser
}