import jwt from "jsonwebtoken";
import { ApiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _,nxt) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiErrors(401,"Unauthorized request !"); 
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if (!user) {
            throw new ApiErrors(401,"Invalid accessToken !")
        }
        req.user = user
        nxt()
    } catch (error) {
        throw new ApiErrors(401,error?.message ||"Invalid Access Token !");
    }
})