/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, VerticalCard } from "../components";
import userService from "../services/user.api.js";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { logOut as authLogOut } from "../store/auth.slice.js";

function ProfilePage() {
    const navigate = useNavigate();
    const { userData, status } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    // console.log("userData:", userData);

    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
        const watchHistory = await userService.getWatchHistory();
        // console.log("watchHistory in profile",watchHistory);
        setHistory(watchHistory);
        };
        fetchHistory();
    }, []);

    if (!userData || !status) {
        return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <p>Loading...</p>
        </div>
        );
    }

    const handleLogout = () => {
        toast
        .promise(userService.logoutUser(), {
            pending: "Logging out...",
            success: "Logged out successfully!",
            error: "Logout failed! Please try again.",
        })
        .then(() => {
            setTimeout(() => {
            dispatch(authLogOut());
            navigate("/login");
            }, 100);
        })
        .catch((error) => {
            console.error("Logout failed:", error);
        });
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
        <div
            className="relative h-60 md:h-72 lg:h-80 bg-cover bg-center"
            style={{ backgroundImage: `url(${userData.coverImage})` }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-4 left-6 flex items-center">
            <img
                src={userData.avatar}
                alt="avatar"
                className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 object-cover rounded-full border-4 border-gray-500 "
            />
            <div className="ml-4">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                {userData.fullName}
                </h1>
                <p className="text-sm md:text-base text-gray-300">
                @{userData.userName}
                </p>
            </div>
            </div>
        </div>

        <div className="px-4 md:px-8 lg:px-8 pt-2">
            <h2 className="text-xl md:text-2xl font-semibold">About</h2>
            <p className="text-gray-300 mt-2 text-sm md:text-base">
            Email: <span className="text-white">{userData.email}</span>
            </p>

            <h2 className="text-xl md:text-2xl font-semibold mt-2">
            Continue Watching for {userData.fullName.split(" ")[0]}
            </h2>
            {history && history.length > 0 ? (
            <ul className="mt-4 flex gap-2">
                {history.map((video) => (
                <section key={video._id}>
                    <VerticalCard video={video} />
                    {/* {video.title} */}
                </section>
                ))}
            </ul>
            ) : (
            <p className="text-gray-400 mt-2 text-sm md:text-base">
                No watch history available.
            </p>
            )}
        </div>

        <div className="mt-8 px-4 py-4 md:px-8 lg:px-8">
            <Button
            onClick={handleLogout}
            className="flex items-center justify-center bg-[#3783D5] text-[#1A2A4D] py-2 rounded-md font-medium hover:bg-[#2E5C97] transition"
            >
            Sign out
            </Button>
        </div>
        <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            transition={Bounce}
        />
        </div>
    );
}

export default ProfilePage;
