/* eslint-disable no-unused-vars */
import React from 'react'
import logo from "../assets/vizzle.png"
import { House,Search,Plus } from 'lucide-react';
import {Avatar} from './index.js';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


function Navbar() {
    const { userData, status } = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const menu = [
        {
            name: "Home",
            icon: <House />,
            link: "/",
            requiresAuth: true,
        },
        {
            name: "Search",
            icon: <Search />,
            requiresAuth: true,
        },
        {
            name: "Create",
            icon: <Plus />,
            link: "/upload",
            requiresAuth: status,
        },
    ]

    const handleMenuItem = (item) => {
        if (item.requiresAuth) {
            navigate(item.link)
        } else {
            navigate("/login")
        }
    }

    return (
        <div className='flex items-center justify-between p-5'>
            <div className=' flex gap-8 items-center navItem '>
                <img src={logo} alt="" className='w-[80px] md:w-[115px] object-cover' />
                <div className='flex items-center gap-8 menu'>
                {menu.map((item) => (
                    <button key={item.name}
                        onClick={()=> item.link && handleMenuItem(item)}
                        className='flex items-center gap-2 cursor-pointer font-semibold hover:underline underline-offset-8 text-[18px]'>
                        {item.icon}
                        <span className='hidden md:inline'>{item.name}</span>
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