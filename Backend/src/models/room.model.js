import mongoose, { Schema } from "mongoose";
const roomSchema = new Schema({
    videoId: {
        type: Schema.Types.ObjectId,
        ref: 'Video',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    participants: [
        {
        type: Schema.Types.ObjectId,
        ref: 'User'
        }
    ],
    currentTime: {
        type: Number,
        default: 0
    },
    host:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
},{timestamps:true})
export const Room = mongoose.model("Room",roomSchema)