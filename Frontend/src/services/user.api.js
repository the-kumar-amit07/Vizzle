import axios from "axios";
import conf from "../conf/conf.js";

export class UserService {
    constructor() {
        this.apiClient = axios.create({
            baseURL: conf.apiUrl,
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        })
    }

    async registerUser({
        fullName,
        email,
        userName,
        password,
        avatar,
        coverImage
    }) {
        try {
            const formData = new FormData();
            formData.append("fullName", fullName);
            formData.append("email", email);
            formData.append("userName", userName);
            formData.append("password", password);
            if (avatar) formData.append("avatar", avatar[0]);
            if (coverImage) formData.append("coverImage", coverImage[0]);

            const response = await this.apiClient.post("/api/v1/users/register", formData,
                {
                headers: { "Content-Type": "multipart/form-data" }
                }
            )
            if (response) {
                return await this.loginUser({email,userName,password})
            }
            return response.data;
        } catch (error) {
            console.error(`UserService::registerUser::error::${error}`);
            throw error.response?.data || error;
        }
    }

    async loginUser({
        email,
        userName,
        password,
    }) {
        try { 
            const userData = { userName, email, password };
            const response = await this.apiClient.post("/api/v1/users/login", userData)
            return response.data;
        }
        catch (error) {
            console.error(`UserService::loginUser::error::${error}`);
            throw error.response?.data || error;
        }
    }

    async logoutUser() {
        try { 
            const response = await this.apiClient.post("/api/v1/users/logout")
            return response.data;
        }
        catch (error) {
            console.error(`UserService::logoutUser::error::${error}`);
            throw error.response?.data || error;
        }
    }

    async changePassword({
        oldPassword,
        newPassword,
    }) {
        try {
            const userData = { oldPassword, newPassword };
            const response = await this.apiClient.post("/api/v1/users/change-password", userData)
            return response.data;
        } catch (error) {
            console.error(`UserService::changePassword::error::${error}`);
            throw error.response?.data || error;
        }
    }

    async getCurrentUser() {
        try {
            const response = await this.apiClient.get("/api/v1/users/current-user")
            return response.data;
        }
        catch (error) {
            console.error(`UserService::getCurrentUser::error::${error}`);
            throw error.response?.data || error;
        }
    }

    async updateAccountDetails({ email, fullName }) {
        try { 
            const userData = { email, fullName };
            const response = await this.apiClient.put("/api/v1/users/update-account", userData)
            return response.data;
        }
        catch (error) {
            console.error(`UserService::updateAccountDetails::error::${error}`);
            throw error.response?.data || error;
        }
    }

    async updateAvatar(avatarFile) {
        try { 
            const formData = new FormData();
            formData.append("avatar", avatarFile);
            const response = await this.apiClient.post("/api/v1/users/avatar", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            return response.data;
        }
        catch (error) {
            console.error(`UserService::updateAvatar::error::${error}`);
            throw error.response?.data || error;
        }
    }

    async updateCoverImage(coverImageFile) {
        try { 
            const formData = new FormData();
            formData.append("coverImage", coverImageFile);
            const response = await this.apiClient.post("/api/v1/users/cover-image", formData,
                { headers: { "Content-Type": "multipart/form-data" } })
            return response.data;
        }
        catch (error) {
            console.error(`UserService::updateCoverImage::error::${error}`);
            throw error.response?.data || error;
        }
    }

    async getChannel(userName) {
        try { 
            const response = await this.apiClient.get(`/api/v1/users/c/${userName}`);
            return response.data;
        }
        catch (error) {
            console.error(`UserService::getChannel::error::${error}`);
            throw error.response?.data || error;
        }
    }

    async getWatchHistory() {
        try { 
            const response = await this.apiClient.get("/api/v1/users/history");
            return response.data;
        }
        catch (error) {
            console.error(`UserService::getWatchHistory::error::${error}`);
            throw error.response?.data || error;
        }
    }
}

const userService = new UserService();
export default userService;