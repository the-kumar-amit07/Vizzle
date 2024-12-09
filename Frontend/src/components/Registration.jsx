/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LogIn, ArrowRightToLine } from "lucide-react";
import { Input, Button } from "./index";
import userService from "../services/user.api.js";
import { useDispatch } from "react-redux";
import { logIn as authLogIn } from "../store/auth.slice.js";
import { Bounce, toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

function Registration() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});

  const onNext = (data) => {
    setFormData({ ...formData, ...data });
    setStep(2);
  };

  const onSubmit = async (data) => {
    const finalData = { ...formData, ...data };
    // console.log("Submitted Data:", finalData);

    // try {
    //   const response = await userService.registerUser(finalData);
    //   if (response) {
    //     console.log("registerUser response:", response);
    //     const currentUser = await userService.getCurrentUser();
    //     if (currentUser) {
    //       dispatch(authLogIn({ userData: currentUser.user }));
    //       navigate("/");
    //     }
    //   }
    // } catch (error) {
    //   console.error("Registration failed. Please try again.", error);
    // }
    toast.promise(
      userService.registerUser(finalData),
      {
        pending: "Signing in...",
        success: "Signed in successfully!",
        error: "Failed to signin. Please try again sometime."
        }
    ).then(async (session) => {
      if (session) {
        const currentUser = await userService.getCurrentUser();
        if (currentUser) {
          dispatch(authLogIn({ userData: currentUser.user }))
          setTimeout(() => {
            navigate("/");
          }, 1000);
        }
      }
    }).catch ((error) => {
        console.error("Registration failed. Please try again.", error);
      })

  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#040C2C]">
      <div className="w-full max-w-md px-6 py-8 bg-[#1A2A4D] border border-gray-200 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-100">
            {step === 1 ? "Create Your Account" : "Set Up Your Profile"}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {step === 1 ? "Account Details" : "Profile Setup"}
          </p>
        </div>

        <form
          onSubmit={
            step === 1 ? handleSubmit(onNext) : handleSubmit(onSubmit)
          }
          className="mt-6 space-y-6"
        >
          {step === 1 && (
            <>
              <Input
                label="Full Name"
                placeholder="Enter Your Full Name"
                className="bg-[#1A2A4D]"
                {...register("fullName", {
                  required: "Full Name is required",
                })}
                error={errors.fullName?.message}
              />

              <Input
                label="Email"
                className="bg-[#1A2A4D]"
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

              <Input
                label="User Name"
                className="bg-[#1A2A4D]"
                placeholder="Enter Your User Name"
                {...register("userName", {
                  required: "User Name is required",
                })}
                error={errors.userName?.message}
              />

              <Input
                label="Password"
                type="password"
                className="bg-[#1A2A4D]"
                placeholder="Enter Your Password"
                {...register("password", {
                  required: "Password is required",
                })}
                error={errors.password?.message}
              />

              <Button
                type="submit"
                className="flex items-center justify-center w-full bg-[#9FFE6F] text-[#1A2A4D] py-2 rounded-md font-medium hover:bg-[#8CE167] transition"
              >
                Next <ArrowRightToLine className="ml-2" size={18} />
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Input
                label="Profile Picture"
                type="file"
                className="bg-[#1A2A4D]"
                {...register("avatar", {
                  required: "Profile picture is required",
                })}
                error={errors.avatar?.message}
              />

              <Input
                label="Cover Image"
                type="file"
                className="bg-[#1A2A4D]"
                {...register("coverImage", {
                  required: "Cover image is required",
                })}
                error={errors.coverImage?.message}
              />

              <Button
                type="submit"
                className="flex items-center justify-center w-full bg-[#9FFE6F] text-[#1A2A4D] py-2 rounded-md font-medium hover:bg-[#8CE167] transition"
              >
                Create Account <LogIn className="ml-2" size={18} />
              </Button>
            </>
          )}
        </form>

        {/* Added the "Already have an account?" section */}
        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-[#9FFE6F] hover:underline"
          >
            Sign In
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
  );
}

export default Registration;