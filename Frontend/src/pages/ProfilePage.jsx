/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import userService from '../services/user.api';


function ProfilePage() {
    const navigate = useNavigate();
    const [userData,setUserData] = useState();
    
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const user = await userService.getCurrentUser()
                console.log("User:",user);
                setUserData(user);
            } catch (error) {
                console.error(error);
            }
        }
        fetchProfile()
    },[])


    return (
        <div className="min-h-screen flex items-center justify-center bg-[#040C2C]">
            User Details </div>
    );
}

export default ProfilePage;
