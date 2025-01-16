/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import './App.css'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom';
import userService from './services/user.api.js';
import { useDispatch } from 'react-redux';
import { logIn } from './store/auth.slice.js';
import {BottomNav}from './components';



function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch()
  useEffect(() => {
    const checkUser = async () => { 
      try {
        const loggedInUser = await userService.getCurrentUser()
        console.log("loggedInUser:",loggedInUser.data);
        
        if (loggedInUser) { 
          dispatch(logIn(loggedInUser.data))
          setLoading(false)
        }
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status ===404) {
          console.log("Unauthorized or user not found:", error.message);
          // Handle unauthorized user (e.g., clear Redux store, redirect to login, or show message)
        } else {
          console.error("Unexpected error:", error);
        }
      } finally {
        setLoading(false);
      }
    }
    checkUser()
  },[])

  if (loading) {
    return <h1>loading....</h1>
  }

  return (
    <>
      <div className='hidden md:block'>
        <Navbar/>
      </div>
      <Outlet />
      <div className='block md:hidden'>
        <BottomNav/>
      </div>
    </>
  )
}

export default App
