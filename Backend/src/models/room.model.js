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
    },
    inviteToken: {
        type: String,
        default: null
    }
}, { timestamps: true })

roomSchema.pre("save", function (nxt) {
    if (!this.inviteToken) {
        this.inviteToken = new mongoose.Types.ObjectId().toString();
    }
    nxt();
})
export const Room = mongoose.model("Room",roomSchema)