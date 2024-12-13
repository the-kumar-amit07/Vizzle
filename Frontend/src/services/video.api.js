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

    async uploadVideo({title,description,category,isPublished,videoFile,thumbnail}) {  //if need ad duration 
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("category", category);
            formData.append("isPublished", isPublished);
            // formData.append("duration", duration);
            formData.append("videoFile", videoFile[0]);
            formData.append("thumbnail", thumbnail[0]);
            const response = await this.apiClient.post("/api/v1/videos/upload", formData, {
                headers: {"Content-Type":"multipart/form-data"},
            })
            return response.data;
        } catch (error) {
            console.error(`VideoService::uploadVideo::error::${error}`);
            throw error.response?.data || error;
        }
    }

    async getAllVideos({ page = 1, limit = 10,query = '', sortBy = 'createdAt',sortType = 'desc',category ,userId }) {
        try {
            const params = { page, limit, query, sortBy, sortType, category ,userId }
            const response = await this.apiClient.get('/api/v1/videos/', { params })
            return response.data;
        } catch (error) {
            console.error(`VideoService::getAllVideos::error::${error}`);
            throw error.response?.data || error;
        }
    }

    async getRecentVideo({ limit = 10 }) {
        try {
            const params = { sortBy: "createdAt", sortType: "desc", limit }
            const response = await this.apiClient.get('/api/v1/videos/', { params })
            console.log("video response: ",response);
            return response.data.data.video;
        }
        catch (error) {
            console.error(`VideoService::getRecentVideo::error::${error}`);
            throw error.response?.data || error;
        }
    }

    async getVideoById(id) {
        try {
            const response = await this.apiClient.get(`/api/v1/videos/v/:${id}`) 
            return response.data;
        }
        catch (error) {
            console.error(`VideoService::getVideoById::error::${error}`);
            throw error.response?.data || error;
        }
    }

    async updateVideo(id,{title,description}) {
        try { 
            const response = await this.apiClient.put(`/api/v1/videos/v/:${id,title, description}`)
            return response.data;
        }
        catch (error) {
            console.error(`VideoService::updateVideo::error::${error}`);
            throw error.response?.data || error;
        }
    }

    async deleteVideo(id) {
        try {
            const response = await this.apiClient.delete(`/api/v1/videos/v/:${id}`)
            return response.data;
        } catch (error) {
            console.error(`VideoService::deleteVideo::error::${error}`);
            throw error.response?.data || error;
        }
    }
}


const videoService = new VideoService();
export default videoService;