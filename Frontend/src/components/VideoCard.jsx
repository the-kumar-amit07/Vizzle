/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';

function VideoCard({ video }) {
    const navigate = useNavigate();
    return (
        <section className="flex flex-col items-center  hover:scale-110 transition-transform duration-150 ease-in-out w-full">
            <div className="w-full h-[80px] md:h-[180px] rounded-lg overflow-hidden">
                <img
                    src={video.thumbnail}
                    onClick={() => { navigate(`/videos/v/${video._id}`); }}
                    alt={video.title}
                    className="w-full h-full object-cover cursor-pointer"
                />
            </div>
        </section>
    );
}

export default VideoCard;
