/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React,{useId} from 'react'

function Toggle({ label, type = "checkbox", className = "", ...props }, ref) {
    const id = useId();
    return (
        <label
        htmlFor= {id}
        className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-green-500"
        >
        <input type={type} id={id} ref={ref} {...props}  className="peer sr-only" />
        
        <span
        className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-all peer-checked:start-6"
        >{label}</span>
        </label>
    )
}

export default React.forwardRef(Toggle)