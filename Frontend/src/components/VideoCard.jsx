/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';

function VideoCard({ video }) {
    const navigate = useNavigate()
    return (
        <section className="flex flex-col items-center">
            <img
                src={video.poster}
                onClick={()=>{navigate(`/videos/v/${video._id}`)}}
                alt={video.title}
                className="w-[110px] md:w-[200px] rounded-lg hover:border-[3px] border-gray-300 cursor-pointer hover:scale-110 transition-all duration-150 ease-in"
            />
        </section>
    );
}

export default VideoCard;
