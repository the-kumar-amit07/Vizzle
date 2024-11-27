import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"

    // Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET 
    })

const uploadOnCloudinary = async (localFilePath) => {
        try {
            if (!localFilePath) return null;
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto",
            })
            fs.unlinkSync(localFilePath)
            // console.log("localFilePath:",localFilePath);
            // console.log("File is uploaded on cloudinary",response);
            return response;
        } catch (error) {
            fs.unlinkSync(localFilePath)
            console.error("Error uploading file to cloudinary", error);
            return null;
        }
    }

const deleteFromCloudinary = async (publicId) => {
        try {
            if (!publicId) return null;
            const response = await cloudinary.uploader.destroy(publicId);
            console.log("Deleted from Cloudinary:", response);
            fs.unlinkSync(publicId)
            return response;
        } catch (error) {
            console.error("Error deleting file from Cloudinary", error);
            return null;
        }
}
const extractPublicIdFromUrl = (url) => {
    if (!url) return null;
    const regex = /\/v\d+\/([^/.]+)\.[a-z]+$/; // Matches public_id in the Cloudinary URL
    const match = url.match(regex);
    return match ? match[1] : null;
};

export {
    uploadOnCloudinary,
    deleteFromCloudinary,
    extractPublicIdFromUrl,
}
