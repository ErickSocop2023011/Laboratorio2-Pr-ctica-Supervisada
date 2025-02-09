'use strick'

import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { dbconnection } from "./mongo.js"
import authRoutes from "../src/auth/auth.routes.js"
import userRoutes from "../src/user/user.routes.js"
import studentRoutes from "../src/student/student.routes.js"
import teacherRoutes from "../src/teacher/teacher.routes.js"
import courseRoutes from "../src/course/course.routes.js"
import apiLimiter from "../src/middlewares/rate-limit-validator.js"



const middlewares =(app) =>{
    app.use(express.urlencoded({extended: false}))
    app.use(express.json())
    app.use(cors())
    app.use(helmet())
    app.use(morgan("dev"))
    app.use(apiLimiter)
}

const routes = (app) =>{
    app.use("/educCenterSystem/v1/auth", authRoutes);
    app.use("/educCenterSystem/v1/user", userRoutes);
    app.use("/educCenterSystem/v1/student", studentRoutes)
    app.use("/educCenterSystem/v1/teacher", teacherRoutes)
    app.use("/educCenterSystem/v1/course", courseRoutes)
}

const ConnectDB = async () =>{
    try{
        await dbconnection()
    }catch(err){
        console.log(`Database connecetion failed ${err}`)
        process.exit(1)
    }
}

export const initServer = () =>{
    const app = express()
    try{
        middlewares(app)
        ConnectDB()
        routes(app)
        app.listen(process.env.PORT)
        console.log(`server running on port ${process.env.PORT}`)
    }catch(err){
        console.log(`server inti failed ${err}`)
    }
}