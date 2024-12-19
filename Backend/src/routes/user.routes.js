import { Router } from "express";
import { logInUser, logOutUser, registerUser, refreshAccessToken, changePassword, getCurrentUser, updateAccountDetails, updateAvatar, updateCoverImage, getChannel, getWatchHistory, searchedByUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount:1
        },
        {
            name: "coverImage",
            maxCount:1
        }
        ]),
    registerUser
)
router.route("/login").post(logInUser)
router.route("/logout").post(varifyJWT, logOutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(varifyJWT, changePassword)
router.route("/current-user").get(varifyJWT, getCurrentUser)
router.route("/update-account").patch(varifyJWT, updateAccountDetails)
router.route("/avatar").patch(varifyJWT, upload.single("avatar"), updateAvatar)
router.route("/cover-image").patch(varifyJWT, upload.single("coverImage"), updateCoverImage)
router.route("/c/:userName").get(varifyJWT, getChannel)
router.route("/search").get(searchedByUser)
router.route("/history").get(varifyJWT, getWatchHistory)

export default router