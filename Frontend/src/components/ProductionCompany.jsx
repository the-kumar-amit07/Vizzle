/* eslint-disable no-unused-vars */
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

function ProductionCompany() {

    const companyList = [
        {
            id: 1, //Disney
            image: "https://res.cloudinary.com/cloudinarysave/image/upload/v1735040494/Production%20Company/pdqcc1khzx5jjepfjdjb.png",
            video: "https://res.cloudinary.com/cloudinarysave/video/upload/v1735040766/Production%20Company/videos/ctoja7m6evzqalj8gz7b.mp4",
        },
        {
            id: 2, //Marvel
            image: "https://res.cloudinary.com/cloudinarysave/image/upload/v1735040494/Production%20Company/xsl8ibv5nyfkiapwxlsx.png",
            video: "https://res.cloudinary.com/cloudinarysave/video/upload/v1735040765/Production%20Company/videos/otzgwrkhvi0ib20euv4g.mp4",
        },
        {
            id: 3, //DC
            image: "https://res.cloudinary.com/cloudinarysave/image/upload/v1735040495/Production%20Company/lhclvmswythmlsfnacnx.png",
            video: "https://res.cloudinary.com/cloudinarysave/video/upload/v1735040765/Production%20Company/videos/mwk7gtwrf6lv8wafzlrs.mp4",
        },
        {
            id: 4,//pixar
            image: "https://res.cloudinary.com/cloudinarysave/image/upload/v1735040494/Production%20Company/hrzkxgpvvp3ntddagnhg.png",
            video: "https://res.cloudinary.com/cloudinarysave/video/upload/v1735040766/Production%20Company/videos/ko17zqty3uododxhtjs2.mp4",
        },
        {
            id: 5, //DreamWorks
            image: "https://res.cloudinary.com/cloudinarysave/image/upload/v1735040495/Production%20Company/mhxy7fsmabm93vpsvprt.png",
            video: "https://res.cloudinary.com/cloudinarysave/video/upload/v1735040766/Production%20Company/videos/umgnobiremeh0uhoztjb.mp4",
        },
        {
            id: 6, //Legendary
            image: "https://res.cloudinary.com/cloudinarysave/image/upload/v1736138865/Production%20Company/zbuoknvp8fnckkyepicu.png",
            video: "https://res.cloudinary.com/cloudinarysave/video/upload/v1736138773/Production%20Company/videos/aya8gadneblskjnpjbqt.mp4",
        },
        
    ]

    return (
            <div className='grid grid-cols-3 gap-2 md:flex md:gap-5 md:mt-4 p-4 px-2 md:px-16'>
            {companyList.map((company) => (
            <div 
                key={company.id} 
                className='relative border-[2px] border-gray-700 rounded-md hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer md:shadow-lg hover:shadow-2xl hover:shadow-indigo-600 shadow-indigo-700 bg-indigo-950'
            >
                <video 
                src={company.video} 
                autoPlay 
                loop 
                playsInline 
                muted 
                className='absolute object-cover w-full h-full z-0 top-0 rounded-md opacity-0 hover:opacity-100' 
                />
                <img 
                src={company.image} 
                className='w-full h-full z-[1] opacity-100' 
                />
            </div>
            ))}
        </div>
    )
}

export default ProductionCompany