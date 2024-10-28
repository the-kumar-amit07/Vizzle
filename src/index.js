// require('dotenv').config({path:'./env'})
import {app} from "./app.js"
import connectDB from "./db/index.js";
import dotenv from "dotenv"


//Approach Two
dotenv.config({
    path : './env'
})

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log(`Connection to Server Failed:`,error)
        })
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at PORT::${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log(`MONGODB-CONNECTION-ERROR`,error)
    })

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