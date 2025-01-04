import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addToWatchHistory, deleteVideo, getAllVideos, getVideoById, updateVideo, uploadVideo } from "../controllers/video.controller.js";

const router = Router();

router.route("/upload").post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
        {
            name: "poster",
            maxCount:1,
        }
    ]),verifyJWT, uploadVideo);

router.route("/v/:videoId").get(getVideoById)
router.route("/").get(getAllVideos)
router.route("/v/:videoId").put(verifyJWT,updateVideo)
router.route("/v/:videoId").delete(verifyJWT, deleteVideo)
router.route("/history/:videoId").post(verifyJWT,addToWatchHistory)

export default router;