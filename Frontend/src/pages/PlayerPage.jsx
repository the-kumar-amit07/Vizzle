/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import {VideoPlayer} from "../components"
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import videoService from '../services/video.api'
import { setCurrentVideos } from '../store/video.slice'

function PlayerPage() {
    const {videoId} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { currentVideo } = useSelector((state) => state.video)

    console.log("videoId:",videoId);
    
    
    useEffect(() => { 
        if (!videoId) return navigate("/")
        const fetchVideo = async () => {
            try {
                const video = await videoService.getVideoById(videoId)
                dispatch(setCurrentVideos(video))
            } catch (error) {
                console.error("Error fetching video:", error)
            }
        }
        fetchVideo()
    }, [videoId, navigate, dispatch])

    const addToWatchHistory = async (videoId) => {
        if (currentVideo) {
            console.log("Adding to watch history...",currentVideo);
            
            try {
                await videoService.addToWatchHistory(videoId)
                console.log("Watch history updated!");
            } catch (error) {
                console.error("Error updating watch history:", error)
            }
        }
    }

    if (!currentVideo) return <p>Loading video...</p>

    return (
        <div className="bg-gray-900 text-white min-h-screen flex flex-col">
            <div className='relative px-8 pt-8'>
                <div className='aspect-w-16 aspect-h-9 bg-black'>
                    <VideoPlayer
                        videoSrc={currentVideo.videoFile}
                        onVideoPlay={() => console.log("Video playing...")}
                        onVideoPause={() => console.log("Video paused...")}
                        onAddToWatchHistory={() => addToWatchHistory(videoId)}
                    />
                </div>
            </div>

            <div className='flex flex-col md:flex-row px-8 py-4 gap-6'>
                <div className='flex-grow'>
                    <h1 className='text-3xl font-bold' >{currentVideo.title}</h1>
                    <div className='mt-2 flex items-center space-x-4 text-sm text-gray-400'>
                        <span>
                            {new Date(currentVideo.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <p className='mt-4'>{currentVideo.description}</p>
                </div>
            </div>
        </div>
    )
}

export default PlayerPage