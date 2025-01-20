/* eslint-disable no-unused-vars */
import React from 'react'
import { House, Search, SquarePlus, CircleUserRound } from 'lucide-react';
import Logo from "../assets/Vizzle.png"
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function BottomNav() {
    const { userData, status } = useSelector((state) => state.auth)
    const navigate = useNavigate()

    const menuItem = [
        {
            id: 1,
            name: "Home",
            icon: <House />,
            link: "/",
            requiresAuth: true,
        },
        {
            id: 2,
            name: "Search",
            icon: <Search />,
            requiresAuth: true,
        },
        {
            id: 3,
            name: "Create",
            icon: <SquarePlus />,
            link: "/upload",
            requiresAuth: status,
        },
        {
            id: 4,
            name: "My Space",
            icon: <CircleUserRound />,
            link: "/profile",
            requiresAuth: status,
        }
    ]

    const handleMenuItem = (item) => {
        if (item.requiresAuth) {
            navigate(item.link)
        }
        else {
            navigate("/login")
        }
    }

    return (
        <div>
            <div className='fixed top-0 left-0 z-50 h-16 flex justify-center items-center w-full'>
                <img src={Logo} alt="" className='w-[100px] md:w-[115px] object-cover'  />
            </div>
            <div className='fixed bottom-0 left-0 z-50 w-full h-16 bg-[#040C2C] border-t border-gray-200'>
            <div className='grid h-full max-w-lg grid-cols-4 mx-auto font-medium'>
                {menuItem.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => item.link && handleMenuItem(item)}
                        className="inline-flex flex-col items-center justify-center px-2 group">
                        <span className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">{item.icon}</span>
                        <span className='text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500'>{item.name}</span>
                    </button>
                ))}
            </div>
        </div>
        </div>
    )
}

export default BottomNav