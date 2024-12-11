import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    videos: [],
    currentVideo: null,
    recentVideos: [],
    loading: false,
    error: null,
};

const videoSlice = createSlice({
    name: "video",
    initialState,
    reducers: {
        setVideos: (state, action) => {
        state.loading = false;
        state.videos = action.payload;
        },
        setCurrentVideos: (state, action) => {
        state.loading = false;
        state.currentVideo = action.payload;
        },
        setRecentVideos: (state, action) => {
        state.loading = false;
        state.recentVideos = action.payload;
        },
        addVideo: (state, action) => {
        state.loading = false;
        state.videos.push(action.payload);
        },
        updateVideo: (state, action) => {
        state.loading = false;
        const index = state.videos.findIndex(
            (video) => video._id === action.payload._id
        );
        if (index !== -1) {
            state.videos[index] = action.payload;
        }
        },
        deleteVideo: (state, action) => {
        state.loading = false;
        state.videos = state.videos.filter(
            (video) => video._id !== action.payload._id
        );
        },
        setError: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        },
        setLoading: (state) => {
        state.loading = true;
        state.error = null;
        },
    },
});

export const {
    setVideos,
    setCurrentVideos,
    setRecentVideos,
    addVideo,
    updateVideo,
    deleteVideo,
    setError,
    setLoading,
} = videoSlice.actions;
export default videoSlice.reducer;
