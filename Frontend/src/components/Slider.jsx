/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react'
import videoService from '../services/video.api.js'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setRecentVideos } from '../store/video.slice'
import { ChevronRight,ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


function Slider() {

    const { recentVideos, loading, error } = useSelector((state) => state.video)
    // console.log("recentVideos",recentVideos);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const cardRef = useRef()
    const screenWidth = window.innerWidth

    useEffect(() => {
        const fetchVideos = async () => {
            dispatch(setLoading())
            try { 
                const videos = await videoService.getRecentVideo({ limit: 5 })
                // console.log("videos:",videos);
                dispatch(setRecentVideos(videos))
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        }
        fetchVideos()
    }, [])

    const slideRight = (el) => {
        el.scrollLeft+=screenWidth-110
    }
    const slideLeft = (el) => {
        el.scrollLeft-=screenWidth-110
    }

    const handleSlide = (direction) => {
        if (cardRef.current) {
            const scrollAmount = screenWidth - 110;
            cardRef.current.scrollLeft += direction === "right" ? scrollAmount : -scrollAmount; 
        }
    }

    if(loading) return <p>Loading recent videos...</p>;

    return (
        <div>
            <ChevronLeft onClick={()=>handleSlide("left")}  className='hidden md:block text-white text-[30px] absolute left-10 top-1/2 transform -translate-y-1/2 cursor-pointer '/>
            <ChevronRight onClick={()=>handleSlide("right")}  className='hidden md:block text-white text-[30px] absolute right-8 top-1/2 transform -translate-y-1/2 cursor-pointer'/>
            <div ref={cardRef} className='flex overflow-x-auto w-full gap-5  md:px-16 py-4 scrollbar-none scroll-smooth'>
            {recentVideos.map((video) => (
                    <img key={video._id} onClick={()=>navigate(`/videos/v/${video._id}`)}  src={video.thumbnail} alt={video.title} className='md:h-[450px] min-w-full object-center md:rounded-md hover:border-[4px] border-[#3783D5] transition-all duration-100 ease-in-out' /> 
            ))}
        </div>
        </div>
    )
}

export default Slider