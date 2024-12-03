import axios from "axios";
import conf from "../conf/conf.js";

export class VideoService {
    constructor() {
        this.apiClient = axios.create({
            baseURL: conf.apiUrl,
            headers: {
                'Content-Type': "application/json",
            },
            withCredentials: true,
        })
    }

    async  uploadVideo({title,description,isPublished,duration,videoFile,thumbnail}) {
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("isPublished", isPublished);
            formData.append("duration", duration);
            formData.append("videoFile", videoFile);
            formData.append("thumbnail", thumbnail);
            const response = await this.apiClient.post("/videos", formData, {
                headers: {"Content-Type":"multipart/form-data"},
            })
            return response.data;
        } catch (error) {
            console.error(`VideoService::uploadVideo::error::${error}`);
            throw error.response?.data || error;
        }
    }

    async getAllVideos({ page = 1, limit = 10,query = '', sortBy = 'createdAt',sortType = 'desc',userId }) {
        try {
            const params = { page, limit, query, sortBy, sortType, userId }
            const response = await this.apiClient.get('/', { params })
            return response.data;
        } catch (error) {
            console.error(`VideoService::getAllVideos::error::${error}`);
            throw error.response?.data || error;
        }
    }

    async getVideoById(id) {
        try {
            const response = await this.apiClient.get(`/videos/${id}`) 
            return response.data;
        }
        catch (error) {
            console.error(`VideoService::getVideoById::error::${error}`);
            throw error.response?.data || error;
        }
    }

    async updateVideo(id,{title,description}) {
        try { 
            const response = await this.apiClient.put(`/videos/${title, description}`)
            return response.data;
        }
        catch (error) {
            console.error(`VideoService::updateVideo::error::${error}`);
            throw error.response?.data || error;
        }
    }

    async deleteVideo(id) {
        try {
            const response = await this.apiClient.delete(`/video/${id}`)
            return response.data;
        } catch (error) {
            console.error(`VideoService::deleteVideo::error::${error}`);
            throw error.response?.data || error;
        }
    }
}


const videoService = new VideoService();
export default videoService;