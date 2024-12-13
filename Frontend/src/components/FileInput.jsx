/* eslint-disable react/prop-types */
import React, { useId } from "react";

function FileInput({ label, type = "file", fileName = "No file selected", className = "", ...props }, ref) {
  const id = useId(); // Generate a unique ID for the input

    return (
        <div className="flex w-full items-center justify-center">
        <label
            htmlFor={id}
            className={`relative ${className} w-full cursor-pointer flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
        >
            <div className="flex flex-col items-center justify-center text-center">

            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-[#3783D5]">
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
                className="text-blue-500 dark:text-white"
                >
                <path d="M12 13v8" />
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                <path d="m8 17 4-4 4 4" />
                </svg>
            </div>


            <p className="mb-1 text-sm font-semibold text-gray-600 dark:text-gray-300">
                {label || "Click to upload"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
                Drag and drop or browse your files
            </p>
            </div>


            <input
            type={type}
            id={id}
            ref={ref}
            {...props}
            className="hidden"
            />

            <div className="mt-4 flex w-full justify-center text-sm text-gray-700 dark:text-gray-300">
            <span className="truncate">{fileName}</span>
            </div>


            <div className="absolute bottom-0 left-0 w-full h-1 bg-[#3783D5]" />
        </label>
        </div>
    );
}

export default React.forwardRef(FileInput);