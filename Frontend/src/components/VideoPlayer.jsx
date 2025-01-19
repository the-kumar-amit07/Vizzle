/* eslint-disable react/prop-types */

/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import { ChevronsRight, ChevronsLeft, Pause, Play } from "lucide-react";

function VideoPlayer({videoSrc,onVideoPlay,onVideoPause,onAddToWatchHistory}) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);


    // Toggle play/pause
    const togglePause = () => {
        if (isPlaying) {
            videoRef.current.pause();
            onVideoPause?.();
        } else {
            videoRef.current.play();
            onVideoPlay?.();
            if(onAddToWatchHistory) onAddToWatchHistory();
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


    return (
            <div className="relative h-full w-full">
                <video
                    ref={videoRef}
                    src={videoSrc}
                    onLoadedMetadata={() => setDuration(videoRef.current.duration)}
                    onTimeUpdate={() => setCurrentTime(videoRef.current.currentTime)}
                    className="w-full h-full object-cover"
                />
                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-transparent to-transparent">
                    <div className="flex items-center justify-center space-x-4">
                        <button onClick={() => videoRef.current.currentTime -= 15}>
                            <ChevronsLeft className="w-6 h-6 text-white" />
                        </button>
                        <button onClick={togglePause}>
                            {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
                        </button>
                        <button onClick={() => videoRef.current.currentTime += 15}>
                            <ChevronsRight className="w-6 h-6 text-white" />
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
    );
}

export default VideoPlayer;
