/* eslint-disable no-unused-vars */
import React from 'react'

function ProductionCompany() {

    const companyList = [
        {
            id: 1, //Disney
            image: "https://res.cloudinary.com/cloudinarysave/image/upload/v1734623264/jexvmkuarxr3qlntxeqh.png",
            video: "https://res.cloudinary.com/cloudinarysave/video/upload/v1734580751/sldbmdegly2l5dqkwfrw.mp4",
        },
        {
            id: 2, //Marvel
            image: "https://res.cloudinary.com/cloudinarysave/image/upload/v1734626241/exbfwngpdrpudjjegmx1.png",
            video: "https://res.cloudinary.com/cloudinarysave/video/upload/v1734580752/crgio1j9eyp8zrsviynw.mp4",
        },
        {
            id: 3, //DC
            image: "https://res.cloudinary.com/cloudinarysave/image/upload/v1734624798/u5xzqictr2z6jkebzfay.png",
            video: "https://res.cloudinary.com/cloudinarysave/video/upload/v1734580751/shrkkgakteujl2dojul5.mp4",
        },
        {
            id: 4,//pixar
            image: "https://res.cloudinary.com/cloudinarysave/image/upload/v1734623264/tpgomgxylpmcrqpbaf8g.png",
            video: "https://res.cloudinary.com/cloudinarysave/video/upload/v1734580752/snqyztzmniwmr0zmqlwi.mp4",
        },
        {
            id: 5, //DreamWorks
            image: "https://res.cloudinary.com/cloudinarysave/image/upload/v1734626074/jngkkzfs4w5lbezcw6uj.png",
            video: "https://res.cloudinary.com/cloudinarysave/video/upload/v1734580755/v2iw6sbittcz5slynz03.mp4",
        },
        
    ]

    return (
        <div  className='flex gap-2 md:gap-5 p-2 px-5 md:px-16 ' >
            {companyList.map((company) => (
                <div key={company.id} className='relative border-[2px] border-gray-700 rounded-lg hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer shadow-xl shadow-slate-600'>
                    <video src={company.video} autoPlay loop playsInline muted   className='absolute object-cover  w-full h-full z-0 top-0 rounded-md opacity-0 hover:opacity-100' />
                    <img src={company.image} className=' w-full h-full z-[1] opacity-100' />
                </div>
            ))}
        </div>
    )
}

export default ProductionCompany