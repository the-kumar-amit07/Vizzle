/* eslint-disable react/prop-types */
import React,{useId} from "react";

function Input({label,type = "text",className = "",...props},ref) {

    const id = useId();
    return (
    label && (
            <label htmlFor= {id}
            className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-[#3783D5] focus-within:ring-1 focus-within:ring-[#3783D5]"
    >
        <input
        type={type}
        id={id}
        ref={ref}
        {...props}
        className={`flex peer h-10 p-2 border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0`}
        />

        <span className={`pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 p-0.5 text-xs ${className} text-gray-100 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs`}>
        {label}
        </span>
    </label>
        )
    );
}

export default React.forwardRef(Input);
