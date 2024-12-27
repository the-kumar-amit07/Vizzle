import { v2 as cloudinary } from 'cloudinary'
import fs from "fs/promises"

    // Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET 
    })

{/*const uploadOnCloudinary = async (localFilePath) => {
        try {
            if (!localFilePath) return null;
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto",
            })
            fs.unlinkSync(localFilePath)
            console.log("localFilePath:",localFilePath);
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
*/}

//--->Optimize way 

const deleteLocalFile = async (filePath) => {
    try { 
        if (filePath) {
            await fs.unlink(filePath)    // because fs.unlinkSync is a synchronous method, meaning it blocks the event loop until the file deletion completes.
            console.log("File deleted from local storage:", filePath);
        }
    }
    catch (error) {
        console.error(`Error deleting local file: ${filePath}`, error.message);
    }
}

const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath) return null;
    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        console.log("Uploaded to Cloudinary:", response.secure_url);
        return response;
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error.message);
        return null;
    } finally {
        await deleteLocalFile(localFilePath);
    }
}

const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return null;
    try {
        const response = await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted from Cloudinary: Public ID ${publicId}`, response);
        return response;
    } catch (error) {
        console.error("Error deleting file from Cloudinary:", error.message);
        return null;
    }
}

const extractPublicIdFromUrl = (url) => {
    if (!url) return null;

    // regex to support all file extensions
    const regex = /\/(?:v\d+\/)?([^/.]+)\.[a-zA-Z0-9]+$/;
    const match = url.match(regex);

    if (match) {
        console.log(`Extracted public ID: ${match[1]} from URL: ${url}`);
        return match[1];
    }

    console.warn("No public ID found in URL:", url);
    return null;
};



export {
    uploadOnCloudinary,
    deleteFromCloudinary,
    extractPublicIdFromUrl,
}
