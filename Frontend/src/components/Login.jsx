/* eslint-disable no-unused-vars */
import React from 'react'
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { LogIn} from "lucide-react";
import { Input, Button } from "./index";
import userService from "../services/user.api.js";
import { useDispatch } from "react-redux";
import { logIn as authLogIn } from "../store/auth.slice.js";
import { Bounce, toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import store from '../store/store.js';

function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const login = async (data) => {
        toast.promise(userService.loginUser(data), {
            pending: "Logging in...",
            success: "Logged in successfully!",
            error: "Failed to login. Please check your credentials."
        }).then(async (session) => {
            if (session) {
                const currentUser = await userService.getCurrentUser()
                // console.log("currentUser",currentUser.data);
                if (currentUser) {
                    dispatch(authLogIn(currentUser.data));
                    // console.log("User data after dispatch:", currentUser.data); 
                    // console.log("State after dispatch:", store.getState()); // Log store state
                            setTimeout(() => {
                                navigate("/");
                            }, 1000);
                        }
            }
        }).catch ((error) => {
            console.error("Login failed. Please try again.", error);
        })
    }
    return (
        <section className="min-h-screen flex items-center justify-center bg-[#040C2C] p-8">
            <div className="w-full max-w-md px-6 py-8 bg-[#24325E] border border-gray-200 rounded-lg shadow-md">
                <div className="text-center">
                    <h2 className="text-3xl font-semibold text-gray-100">
                        Login
                    </h2>
                </div>
                <form onSubmit={handleSubmit(login)} className="mt-6 space-y-6">

                <Input
                    label="Email"
                    className="bg-[#24325E]"
                    placeholder="Enter Your Email Address"
                    {...register("email", {
                    required: "Email is required",
                    pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Enter a valid email address",
                    },
                    })}
                    error={errors.email?.message}
                />
                    
                {/* <Input
                    label="User Name"
                    className="bg-[#24325E]"
                    placeholder="Enter Your User Name"
                    {...register("userName", {
                    required: "User Name is required",
                    })}
                    error={errors.userName?.message}
                /> */}
                    
                <Input
                    label="Password"
                    type="password"
                    className="bg-[#24325E]"
                    placeholder="Enter Your Password"
                    {...register("password", {
                    required: "Password is required",
                    })}
                    error={errors.password?.message}
                    />
                
                <Button
                    type="submit"
                    className="flex items-center justify-center w-full bg-[#3783D5] text-[#1A2A4D] py-2 rounded-md font-medium hover:bg-[#2E5C97] transition"
                >
                    Sign In <LogIn className="ml-2" size={18} />
                </Button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-400">
                Don&apos;t have an account?{" "}
                <Link
                    to="/register"
                    className="font-medium text-[#3783D5] hover:underline"
                >
                    Register
                </Link>
                </p>
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
        </section>
    )
}

export default Login