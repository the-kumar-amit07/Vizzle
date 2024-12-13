/* eslint-disable react/prop-types */
import React, { useId } from "react";

function Toggle({ label, type = "checkbox", className = "", ...props }, ref) {
    const id = useId();
    return (
        <div className="flex items-center space-x-4">
        {label && (
            <span className="text-gray-700 dark:text-gray-300">{label}</span>
        )}
        <label
            htmlFor={id}
            className={`relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-green-500${className}`}
        >
            <input
            type={type}
            id={id}
            ref={ref}
            {...props}
            className="peer sr-only"
            />

            <span className="absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-md transition-all peer-checked:left-7"></span>
        </label>
        </div>
    );
}

export default React.forwardRef(Toggle);
