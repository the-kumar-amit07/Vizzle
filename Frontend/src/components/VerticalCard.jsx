/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';

function VerticalCard({ video }) {
    const navigate = useNavigate()
    return (
        <section className="flex flex-col items-center hover:scale-105  transition-all duration-150  ease-in ">
            <img
                onClick={()=>{navigate(`/videos/v/${video._id}`)}}
                src={video.poster}
                className="w-[110px] md:w-[200px] rounded-lg hover:border-[3px] border-[#3783D5] cursor-pointer "
            />
            {/* <h2
                className="w-[110px] md:w-[200px] text-center text-white mt-2 text-sm md:text-base font-semibold"
            >
                {video.title}
            </h2> */}
        </section>
    );
}

export default VerticalCard;
