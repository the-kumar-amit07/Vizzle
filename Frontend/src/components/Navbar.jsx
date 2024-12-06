/* eslint-disable no-unused-vars */
import React from 'react'
import logo from "../assets/vizzle.png"
import { House,Search,Plus } from 'lucide-react';
import {Avatar} from './index.js';


function Navbar() {
    const menu = [
        {
            name: "Home",
            icon: <House/>
        },
        {
            name: "Search",
            icon: <Search/>
        },
        {
            name: "WatchList",
            icon: <Plus/>
        },
    ]
    return (
        <div className='flex items-center justify-between p-5'>
            <div className=' flex gap-8 items-center navItem '>
                <img src={logo} alt="" className='w-[80px] md:w-[115px] object-cover' />
                <div className='flex items-center gap-3 menu'>
                {menu.map((item) => (
                    <button key={item.name} className='flex items-center gap-2 cursor-pointer font-semibold text-[18px]'>
                        {item.icon}
                        {item.name}
                    </button>
                ))}
                </div>
            </div>
            <div >
                <Avatar />
            </div>
        </div>
    )
}

export default Navbar