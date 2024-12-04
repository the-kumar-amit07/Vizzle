import axios from "axios";
import conf from "../conf/conf.js";

export class RoomService {
    constructor() {
        this.apiClient = axios.create({
            baseURL: conf.apiUrl,
            headers: {
                'Content-Type': "application/json",
            },
            withCredentials: true,
        })
    }

    async createRoom({videoId, title}) {
        try {
            const response = await this.apiClient.post('/create-room', { videoId, title })
            return response.data
        } catch (error) {
            console.error(`RoomService::createRoom::error::${error}`);
            throw error.response?.data || error;
        }
    }

    async joinRoom(inviteToken) {
        try {
            const response = await this.apiClient.post(`/room/join/${inviteToken}`)
            return response.data
        } catch (error) {
            console.error(`RoomService::joinRoom::error::${error}`);
            throw error.response?.data || error;
        }
    }

    async getRoomInfo(roomId) {
        try { 
            const response = this.apiClient.get(`/room/${roomId}`)
            return response.data
        }
        catch (error) {
            console.error(`RoomService::getRoomInfo::error::${error}`);
            throw error.response?.data || error;
        }
    }

    async getInviteLink(inviteToken) {
        try {
            const response = await this.apiClient.get(`/room/invite-link/${inviteToken}`)
            return response.data
        }
        catch (error) {
            console.error(`RoomService::getInviteLink::error::${error}`);
            throw error.response?.data || error;
        }
    }
}

const roomService = new RoomService();
export default roomService;