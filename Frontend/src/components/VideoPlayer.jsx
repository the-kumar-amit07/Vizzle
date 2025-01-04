/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from "react";
import { ChevronsRight, ChevronsLeft, Pause, Play } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import videoService from "../services/video.api.js";
import { setCurrentVideos } from "../store/video.slice.js";

function VideoPlayer() {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0); // 0 to 1
    const { videoId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentVideo } = useSelector((state) => state.video);

    console.log("VideoId",videoId);
    
    // Fetch video details
    useEffect(() => {
        if (!videoId) return navigate("/");

        const fetchVideo = async () => {
            try {
                const video = await videoService.getVideoById(videoId);
                dispatch(setCurrentVideos(video));
                // addToWatchHistory(videoId)
            } catch (error) {
                console.error("Error fetching video:", error);
            }
        };
        fetchVideo();
    }, [videoId, navigate, dispatch]);

        const addToWatchHistory = async (videoId) => {
            if (isPlaying) {
                try {
                    await videoService.addToWatchHistory(videoId);
                    // console.log("Watch history updated!");
                } catch (error) {
                    console.error("Error updating watch history:", error);
                }
            }
            
        }

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            const maxScroll = window.innerHeight; // Maximum scroll distance (height of the viewport)
            const scrollTop = window.scrollY; // Current scroll position
            const progress = Math.min(scrollTop / maxScroll, 1); // Normalize scroll progress between 0 and 1
            setScrollProgress(progress); // Update scroll progress
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Toggle play/pause
    const togglePause = () => {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e) => {
        const seekTime = (e.target.value / 100) * duration;
        videoRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
    };

    // Format time for display
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    if (!currentVideo) return <p>Loading video...</p>;

    // Calculate styles for the description section based on scrollProgress
    const descriptionOpacity = Math.min(scrollProgress, 1); // Fade in as you scroll
    const descriptionTranslateY = (1 - scrollProgress) * 100; // Move up as you scroll

    return (
        <div className="h-screen overflow-y-scroll bg-gray-900 text-white">
            {/* Full-Screen Video Player */}
            <div className="relative h-screen bg-black">
                <video
                    ref={videoRef}
                    src={currentVideo.videoFile}
                    onLoadedMetadata={() => setDuration(videoRef.current.duration)}
                    onTimeUpdate={() => setCurrentTime(videoRef.current.currentTime)}
                    className="w-full h-full object-cover"
                    // autoPlay
                    onPlay={() =>addToWatchHistory(videoId)}
                />
                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-transparent to-transparent">
                    <div className="flex items-center justify-center space-x-4">
                        <button onClick={() => videoRef.current.currentTime -= 15}>
                            <ChevronsLeft className="w-6 h-6" />
                        </button>
                        <button onClick={togglePause}>
                            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </button>
                        <button onClick={() => videoRef.current.currentTime += 15}>
                            <ChevronsRight className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="flex items-center mt-4">
                        <span className="text-sm">{formatTime(currentTime)}</span>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={(currentTime / duration) * 100 || 0}
                            onChange={handleSeek}
                            className="flex-grow mx-4 h-2 bg-gray-700 rounded"
                        />
                        <span className="text-sm">{formatTime(duration)}</span>
                    </div>
                </div>
            </div>

            {/* Transparent Description Section */}
            <div
                style={{
                    opacity: descriptionOpacity,
                    transform: `translateY(${descriptionTranslateY}px)`,
                }}
                className="fixed top-0 left-0 w-full p-6 bg-gray-900/50 backdrop-blur-md text-white z-10 transition-all duration-300"
            >
                <h1 className="text-2xl font-bold">{currentVideo.title}</h1>
                <p className="mt-2 text-sm text-gray-400">
                    Uploaded on: {new Date(currentVideo.createdAt).toLocaleDateString()}
                </p>
                <p className="mt-4">{currentVideo.description}</p>
            </div>
        </div>
    );
}

export default VideoPlayer;
