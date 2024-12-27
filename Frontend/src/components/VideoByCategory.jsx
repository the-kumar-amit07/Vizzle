/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import videoService from '../services/video.api.js'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setVideos } from '../store/video.slice'
import {CategoryList} from '../components'



function VideoByCategory() {
    const { videos, loading } = useSelector((state) => state.video)
    // console.log("Videos", videos.map((video) => video.category));
    console.log("Videos Fetch in VideoByCategory", videos);
    
    const groupByCategory = (videos = []) => {
        return videos.reduce((acc, video) => {
            if (!video.category) {
                console.error("Video without category:", video);
                return acc; // Skip videos without a valid category
            }
            if (!acc[video.category]) {
                acc[video.category] = []
            }
            acc[video.category].push(video)
            return acc
        },{})
    }
    
    useEffect(() => {
        const fetchVideos = async () => {
            dispatch(setLoading())
            try {
                const videoCategory = await videoService.getAllVideos({ page: 1 })
                console.log("videoCategory: ",videoCategory);
                
                dispatch(setVideos(videoCategory.data.video))
            } catch (error) {
                console.error('Error fetching videos in Category :', error);
            }
        }
        fetchVideos()
    },[])
    const dispatch = useDispatch()

    const Groups = groupByCategory(videos)
    console.log("Groups of VideoCategory",Groups);
    
    if(loading) return <p>Loading recent videos...</p>;
    return (
        <div className='mt-8'>
            {
                Object.keys(Groups).map((category,index) => index<=4 && (
                    <div key={category} className='p-4 px-8 md:px-16'>
                        <h2 className='text-white text-[20px] font-bold'>{category}</h2>
                        <CategoryList videos={Groups[category]} indx={index} />
                    </div>
                ))
            }
        </div>
    )
}

export default VideoByCategory