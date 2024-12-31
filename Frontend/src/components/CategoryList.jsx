/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { VideoCard, VerticalCard } from './index';

function CategoryList({ videos, indx }) {
    const { loading } = useSelector((state) => state.video);
    const videosRef = useRef(null);

    const slideLeft = (item) => {
        item.scrollLeft -= 500;
    };

    const slideRight = (item) => {
        item.scrollLeft += 500;
    };

    if (loading) return <p>Loading recent videos...</p>;

    return (
        <div className="relative">
            <ChevronLeft
                onClick={() => slideLeft(videosRef.current)}
                className={`text-[50px] text-white z-10 cursor-pointer hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2`}
            />
            <div
                ref={videosRef}
                className="flex overflow-x-auto gap-8 scrollbar-none scroll-smooth pt-4 md:px-8 pb-4"
            >
                {videos.map((video) => (
                    <div key={video._id}>
                        {indx % 3 === 0 ? (
                            <VerticalCard video={video} />
                        ) : (
                            <VideoCard video={video} />
                        )}
                    </div>
                ))}
            </div>
            <ChevronRight
                onClick={() => slideRight(videosRef.current)}
                className={`text-[50px] text-white z-10 cursor-pointer hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2`}
            />
        </div>
    );
}

export default CategoryList;
