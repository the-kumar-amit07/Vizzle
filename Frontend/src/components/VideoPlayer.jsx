/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from "react";
import { debounce } from "lodash";
import { ChevronsRight, ChevronsLeft, Pause, Play } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import videoService from "../services/video.api.js";
import { setCurrentVideos } from "../store/video.slice.js";

function VideoPlayer() {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false)
    const currentTimeRef = useRef(0);
    const { videoId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentVideo } = useSelector((state) => state.video);

    useEffect(() => {
        if (videoId) {
        const fetchVideo = async () => {
            try {
            const video = await videoService.getVideoById(videoId);
            dispatch(setCurrentVideos(video));
            } catch (error) {
            console.error("Error fetching videos:", error);
            }
        };
        fetchVideo();
        } else {
        navigate("/");
        }
    }, [videoId, navigate, dispatch]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.screenY;
            setIsScrolled(scrollTop > 100);
        }
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    },[])

    const togglePause = () => {
        if (isPlaying) {
        videoRef.current.pause();
        } else {
        videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleLoadedMetadata = () => {
        setDuration(videoRef.current.duration);
    };

    const handleSeek = (ev) => {
        const seekTime = (ev.target.value / 100) * duration;
        videoRef.current.currentTime = seekTime;
        currentTimeRef.current = seekTime;
    };

    const seekForward = () => {
        videoRef.current.currentTime = Math.min(
        videoRef.current.currentTime + 15,
        duration
        );
    };

    const seekBackward = () => {
        videoRef.current.currentTime = Math.max(
        videoRef.current.currentTime - 15,
        0
        );
    };

    const handleTimeUpdate = useRef(
        debounce(() => {
        currentTimeRef.current = videoRef.current.currentTime;
        }, 100)
    );

    useEffect(() => {
        const interval = setInterval(() => {
        setCurrentTime(currentTimeRef.current);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    if (!currentVideo) {
        return <p>Loading video...</p>;
    }

return (
    <div ref={containerRef} className="h-screen overflow-y-scroll scrollbar-none scroll-smooth bg-gray-900 text-white">
        <div className={`transition-all duration-500 ${
            isScrolled ? "h-64" : "h-screen"
        } relative bg-black `}>

            <video
            ref={videoRef}
            src={currentVideo.videoFile}
            onTimeUpdate={handleTimeUpdate.current}
            onLoadedMetadata={handleLoadedMetadata}
            controls={false}
            className="w-full h-full object-cover rounded-lg"
            />


            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-transparent to-transparent">
            <div className="flex items-center justify-center space-x-2">

                <button
                onClick={seekBackward}
                className="p-2 rounded-full  hover:bg-slate-500  text-white transition-all duration-300 shadow-md"
                title="Rewind 15 seconds"
                >
                <ChevronsLeft className="w-6 h-6" />
                </button>


                <button
                onClick={togglePause}
                className="p-2 rounded-full  hover:bg-slate-500  text-white transition-all duration-300 shadow-md"
                title={isPlaying ? "Pause" : "Play"}
                >
                {isPlaying ? (
                    <Pause className="w-6 h-6" />
                ) : (
                    <Play className="w-6 h-6" />
                )}
                </button>


                <button
                onClick={seekForward}
                className="p-2 rounded-full  hover:bg-slate-500  text-white transition-all duration-300 shadow-md"
                title="Forward 15 seconds"
                >
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
                className="flex-grow mx-4 appearance-none h-2 bg-gray-700 rounded-lg hover:bg-gray-600  transition-all"
                />
                <span className="text-sm">{formatTime(duration)}</span>
            </div>
            </div>
        </div>

        <div  className={`transition-opacity duration-500 ${isScrolled ? "opacity-100" : "opacity-0"} p-6`}>
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
