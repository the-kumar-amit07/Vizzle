/* eslint-disable no-unused-vars */
import React from "react";
import { Input, FileInput, Button, Toggle } from "./index";
import videoService from "../services/video.api.js";
import { addVideo } from "../store/video.slice.js";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

function VideoUpload() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const upload = async (data) => {
        console.log("Video data : ", data);
        console.log("Video file: ", data.videoFile);
        console.log("Thumbnail file: ", data.thumbnail);

        toast
        .promise(videoService.uploadVideo(data), {
            pending: "Uploading...",
            success: "Video Uploaded successfully!",
            error: "Failed to upload. Please try again.",
        })
        .then(async (session) => {
            console.log("Upload Session", session);

            if (session) {
            dispatch(addVideo(session.data));
            setTimeout(() => {
                navigate("/videos");
            }, 1000);
            }
        })
        .catch((error) => {
            console.error("Failed to upload. Please try again later.", error);
        });
    };
    return (
        <section>
        <div className="w-full max-w-md px-6 py-8 bg-[#24325E] border border-gray-200 rounded-lg shadow-md">
            <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-100">Upload Files</h2>
            </div>
            <form onSubmit={handleSubmit(upload)}>
            <Input
                label="Enter Title"
                className="bg-[#24325E]"
                {...register("title", {
                required: "title is required",
                })}
                error={errors.title?.message}
            />

            <Input
                label="Enter Description"
                className="bg-[#24325E]"
                {...register("description", {
                required: "description is required",
                })}
                error={errors.description?.message}
            />
            <Input
                label="Enter Category"
                className="bg-[#24325E]"
                {...register("category", {
                required: "category is required",
                })}
                error={errors.category?.message}
            />
{/* 
            <Toggle
                label="Status"
                {...register("status", {
                required: "status is required",
                })}
                error={errors.status?.message}
            /> */}

            <FileInput
                label="Click to Upload Video"
                type="file"
                className="h-40"
                {...register("videoFile", {
                required: "Video File is required",
                })}
                error={errors.videoFile?.message}
            />
            <FileInput
                label="Click to Upload Thumbnail"
                type="file"
                className="h-40"
                {...register("thumbnail", {
                required: "Thumbnail File is required",
                })}
                error={errors.thumbnail?.message}
            />
            <Button
                type="submit"
                className="flex items-center justify-center w-full bg-[#3783D5] text-[#1A2A4D] py-2 rounded-md font-medium hover:bg-[#2E5C97] transition"
            >
                Upload <Upload className="ml-2" size={18} />
            </Button>
            </form>
            </div>
            <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
        />
        </section>
    );
}

export default VideoUpload;
