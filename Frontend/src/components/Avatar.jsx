/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

const Avatar = ({ avatarUrl, userName, onClick }) => {
    return (
        <div
        className="group flex  flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-300"
        onClick={onClick}
        >
        <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-lg border-4 border-transparent group-hover:border-[#A3FB73]">
            <img
            src={avatarUrl}
            alt={`${userName}'s avatar`}
            className="object-cover w-full h-full"
            />
        </div>
        <p className="mt-2 text-sm text-center font-medium text-gray-200 group-hover:text-white">
            {userName}
        </p>
        </div>
    );
};

export default Avatar;