import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth.slice.js";
import videoSlice from "./video.slice.js";
import roomSlice from "./room.slice.js";

const store = configureStore({
    reducer: {
        auth: authSlice,
        video: videoSlice,
        room: roomSlice,
    }
});

export default store;