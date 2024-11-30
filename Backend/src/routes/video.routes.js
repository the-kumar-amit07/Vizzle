import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";
import { deleteVideo, getAllVideos, getVideoById, updateVideo, uploadVideo } from "../controllers/video.controller.js";

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
        }
    ]),varifyJWT, uploadVideo);

router.route("/v/:videoId").get(getVideoById)
router.route("/").get(getAllVideos)
router.route("/v/:videoId").put(varifyJWT,updateVideo)
router.route("/v/:videoId").delete(varifyJWT,deleteVideo)

export default router;