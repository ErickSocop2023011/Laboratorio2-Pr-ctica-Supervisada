import bcrypt from "bcryptjs"
import User from "../user/user.model.js"
import Student from "../student/student.model.js"
import Teacher from "../teacher/teacher.model.js"
import { generateJWT } from "../helpers/generate-jwt.js"

export const register = async (req, res) => {
    try {
        const data = req.body

        const salt = bcrypt.genSaltSync(10)
        const encryptedPassword = bcrypt.hashSync(data.password, salt)
        data.password = encryptedPassword

        const user = await User.create(data)

        let extraData = null
        if (data.role === "STUDENT_ROLE") {
            const studentData = {
                userId: user._id,
                idCardNumber: data.idCardNumber,
                grade: data.grade,
                coursesAssigned: data.coursesAssigned || [],
                technicalCareer: data.technicalCareer || "",
            }
            extraData = await Student.create(studentData)
        } else if (data.role === "TEACHER_ROLE") {
            const teacherData = {
                userId: user._id,
                department: data.department,
            }
            extraData = await Teacher.create(teacherData)
        }

        return res.status(201).json({
            message: "Usuario registrado exitosamente",
            user: { ...user.toObject(), extraData },
        })
    } catch (err) {
        return res.status(500).json({
            message: "Error en el registro del usuario",
            error: err.message,
        })
    }
}



export const login = async (req, res) => {
    const { email,username,password } = req.body
    try {
        const user = await User.findOne({
            $or:[{email: email}, {username: username}]
        })

        if(!user){
            return res.status(400).json({
                message: "Invalid Credentials",
                error:"The email or username entered does not exist"
            })
        }

        const validPassword = await bcrypt.compare(password, user.password)
        if(!validPassword){
            return res.status(400).json({
                message: "Invalid Credentials",
                error: "Incorrect password"
            })
        }

        const token = await generateJWT(user.id)

        return res.status(200).json({
            message: "Login successful",
            userDetails: {
                token: token,
                message: `Welcome Back! ${username}`
            }
        })
    } catch (err) {
        return res.status(500).json({
            message: "login failed, server error",
            error: err.message
        })
    }

}