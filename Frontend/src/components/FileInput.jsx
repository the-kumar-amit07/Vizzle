/* eslint-disable react/prop-types */
import React, { useId } from "react";

function FileInput({ label, type = "file", className = "", ...props }, ref) {
  const id = useId(); // Generate a unique ID for the input

    return (
        <div className="flex w-full items-center justify-center">
        <label
                htmlFor={id} // Associate label with input
                className={`flex ${className} w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600`}>
            <div className="flex flex-col items-center justify-center pb-6 pt-6">
            {/* Cloud Upload Icon */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-cloud-upload"
            >
                <path d="M12 13v8" />
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                <path d="m8 17 4-4 4 4" />
            </svg>

            {/* Upload Instructions */}
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">{label || "Click to upload"}</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
            </div>

            {/* Hidden Input */}
            <input
            type={type}
            id={id}
            ref={ref} // Properly pass the ref
            {...props}
            className="hidden"
            />
        </label>
        </div>
    );
};

export default React.forwardRef(FileInput);