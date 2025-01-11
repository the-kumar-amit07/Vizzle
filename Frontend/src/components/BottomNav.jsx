/* eslint-disable no-unused-vars */
import React from 'react'
import { House,Search,SquarePlus,CircleUserRound } from 'lucide-react';

function BottomNav() {

    const menuItem = [
        {
            id: 1,
            name: "Home",
            icon: <House />,
        },
        {
            id: 2,
            name: "Search",
            icon: <Search />,
        },
        {
            id: 3,
            name: "Create",
            icon:  <SquarePlus />,
        },
        {
            id: 4,
            name: "My Space",
            icon: <CircleUserRound />,
        }
    ]

    return (
        <div>
            <div className='fixed top-0 left-0 z-50 h-16 bg-slate-600 border-stone-300 w-full'>
                <h1 className='flex'>logo</h1>
            </div>
            <div className='fixed bottom-0 left-0 z-50 w-full h-16 bg-slate-700 border-t border-gray-200'>
            <div className='grid h-full max-w-lg grid-cols-4 mx-auto font-medium'>
                {menuItem.map((item) => (
                    <button key={item.id} type="button" className="inline-flex flex-col items-center justify-center px-2 hover:bg-gray-50 group">
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