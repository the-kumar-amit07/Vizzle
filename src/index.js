// require('dotenv').config({path:'./env'})
import connectDB from "./db/index.js";
import dotenv from "dotenv"


//Approach Two
dotenv.config({
    path : './env'
})

connectDB()

/* Approach One
import express from "express"
const app = express()

(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error) => {
            console.log("Error",error)
            throw error
        })
        app.listen(process.env.PORT, ()=>{
            console.log(`App is running on port${process.env.PORT}`)
        })
    }
    catch (error) {
        console.log(error);
        throw error
        }
}) () */