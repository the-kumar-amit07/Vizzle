/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react'
import videoService from '../services/video.api'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setRecentVideos } from '../store/video.slice'
import { ChevronRight,ChevronLeft } from 'lucide-react';


function Slider() {

    const {recentVideos,loading,error} = useSelector(state => state.video)
    const dispatch = useDispatch()
    const cardRef = useRef()
    useEffect(() => {
        const fetchVideos = async () => {
            dispatch(setLoading())
            try { 
                const videos = await videoService.getRecentVideo({ limit: 10 })
                console.log("videos:",videos);
                dispatch(setRecentVideos(videos))
            } catch (e) {
                console.log(e)
            }
        }
        fetchVideos()
    }, [dispatch])

    const slideRight = (el) => {
        el.scrollLeft+=800
    }
    const slideLeft = (el) => {
        el.scrollLeft-=800
    }

    if(loading) return <p>Loading recent videos...</p>;

    return (
        <div>
            <ChevronLeft onClick={()=>slideLeft(cardRef.current)}  className='hidden md:block text-white text-[30px] absolute mx-8 mt-[150px] cursor-pointer '/>
            <ChevronRight onClick={()=>slideRight(cardRef.current)}  className='hidden md:block text-white text-[30px] absolute mx-8 mt-[150px] cursor-pointer right-0'/>
            <div ref={cardRef} className='flex overflow-x-auto w-full px-16 py-4 scrollbar-none scroll-smooth'>
            {recentVideos.map((video) => (
                    <img key={video._id}  src={video.thumbnail} alt={video.title} className='md:h-[310px] min-w-full mr-5 object-cover object-left-top rounded-md hover:border-[4px] border-[#3783D5] transition-all duration-100 ease-in-out' /> 
            ))}
        </div>
        </div>
    )
}

export default Slider