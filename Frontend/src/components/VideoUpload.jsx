/* eslint-disable no-unused-vars */
import React from "react";
import { FileInput, Button, Toggle, Input } from "./index";
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
        setValue, // We use setValue to set files manually
    } = useForm(
        {
        defaultValues: {
            title: "",
            description: "",
            category: "",
            isPublished: true,
        }
    }
    );
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
        <section className="min-h-screen flex items-center justify-center bg-[#040C2C] px-4">
        <div className="w-full max-w-lg bg-[#24325E] border border-gray-700 rounded-lg shadow-lg">
            <div className="px-8 py-6 text-center border-b border-gray-700">
            <h2 className="text-2xl font-semibold text-white">Upload Your Video</h2>
            <p className="text-sm text-gray-400 mt-1">Provide all necessary details to upload your video</p>
            </div>
            <form onSubmit={handleSubmit(upload)} className="px-8 py-6 space-y-4">
            <Input
                label="Title"
                placeholder="Enter Title"
                className="bg-[#24325E]"
                {...register("title", {
                required: "Title is required",
                })}
                error={errors.title?.message}
            />
            <Input
                label="Description"
                placeholder="Enter Description"
                className="bg-[#24325E]"
                {...register("description", {
                required: "Description is required",
                })}
                error={errors.description?.message}
            />
            <Input
                label="Category"
                placeholder="Enter Category"
                className="bg-[#24325E]"
                {...register("category", {
                required: "Category is required",
                })}
                error={errors.category?.message}
            />
            <Toggle
                        label="Publish Status"
                        defaultChecked={true}
                        {...register("isPublished")}
                        onChange={(ev)=> setValue("isPublished",ev.target.checked)}
                        error={errors.isPublished?.message}
            />        
            <FileInput
                label="Video File"
                type="file"
                {...register("videoFile", {
                required: "Video File is required",
                })}
                // onChange={(file) => setValue("videoFile", file)}
                error={errors.videoFile?.message}
            />
            <FileInput
                label="Thumbnail"
                type="file"
                {...register("thumbnail", {
                required: "Thumbnail is required",
                })}
                // onChange={(file) => setValue("thumbnail", file)} 
                error={errors.thumbnail?.message}
            />
            <Button
                type="submit"
                className="w-full flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
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