/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'

function Button({
    children,
    type = 'button',
    bgColor = 'bg-blue-600',
    textColor = 'text-white',
    className = "",
    ...props
}) {
    return (
    <button
    className={`px-4 py-2 rounded-md
        ${className}
        ${type}
        ${bgColor}
        ${textColor}
        `} 
        {...props}
    > 
        {children}
    </button>
    )
}

export default Button


{/* Base */}

{/* <a
  className="group relative inline-block text-sm font-medium text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
  href="#"
>
  <span
    className="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-indigo-600 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"
  ></span>

  <span className="relative block border border-current bg-white px-8 py-3"> Download </span>
</a> */}

