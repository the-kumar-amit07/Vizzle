/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LogIn, ArrowRightToLine } from "lucide-react";
import { Input, Button, FileInput } from "./index";
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
    watch,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});

  const [avatarName, setAvatarName] = useState("");
  const [coverImageName, setCoverImageName] = useState("")
  const avatarFile = watch("avatar");
  const coverImageFile = watch("coverImage");
  useEffect(() => {
    if (avatarFile && avatarFile[0]) {
      setAvatarName(avatarFile[0].name)
    }
  }, [avatarFile])
  useEffect(() => {
    if (coverImageFile && coverImageFile[0]) {
      setCoverImageName(coverImageFile[0].name)
    }
  },[coverImageFile])
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
          dispatch(authLogIn(currentUser.data))
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
      <div className="w-full max-w-lg px-6 py-8 bg-[#24325E] border border-gray-200 rounded-lg shadow-md">
        <div className="px-8 py-6 text-center border-b border-gray-700">
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
          className="mt-6 px-8 py-6 space-y-6"
        >
          {step === 1 && (
            <>
              <Input
                label="Full Name"
                placeholder="Enter Your Full Name"
                className="bg-[#24325E]"
                {...register("fullName", {
                  required: "Full Name is required",
                })}
                error={errors.fullName?.message}
              />

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

              <Input
                label="User Name"
                className="bg-[#24325E]"
                placeholder="Enter Your User Name"
                {...register("userName", {
                  required: "User Name is required",
                })}
                error={errors.userName?.message}
              />

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
                Next <ArrowRightToLine className="ml-2" size={18} />
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              {/* <Input
                label="Profile Picture"
                type="file"
                className="bg-[#1A2A4D]"
                {...register("avatar", {
                  required: "Profile picture is required",
                })}
                error={errors.avatar?.message}
              /> */}

              <FileInput
                label="Profile Picture"
                type="file"
                {...register("avatar", {
                  required: "Profile picture is required",
                })}
                fileName = {avatarName}
                error={errors.avatar?.message}
              />
              <FileInput
                label="Cover Image"
                type="file"
                {...register("coverImage", {
                  required: "Cover image is required",
                })}
                fileName={coverImageName}
                error={errors.avatar?.message}
              />

              <Button
                type="submit"
                className="flex items-center justify-center w-full bg-[#3783D5] text-[#1A2A4D] py-2 rounded-md font-medium hover:bg-[#2E5C97] transition"
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
            className="font-medium text-[#3783D5] hover:underline"
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