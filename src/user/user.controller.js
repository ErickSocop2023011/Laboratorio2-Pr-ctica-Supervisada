import bcrypt from "bcryptjs"
import User from "../user/user.model.js"
import Student from "../student/student.model.js"
import Teacher from "../teacher/teacher.model.js"


export const getUserById = async (req, res) => {
    try {
        const { uid } = req.params 
        const user = await User.findById(uid).lean()

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        let extraData
        if (user.role === "STUDENT_ROLE") {
            extraData = await Student.findOne({ userId: user._id }).lean() 
        } else if (user.role === "TEACHER_ROLE") {
            extraData = await Teacher.findOne({ userId: user._id }).lean() 
        }


        return res.status(200).json({
            success: true,
            user: { ...user, extraData }
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error getting user",
            error: err.message
        })
    }
}


export const getUsers = async (req, res) => {
    try {
        const { limite = 5, desde = 0 } = req.query 
        const query = { status: true } 

        const users = await User.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .lean() 

        const usersWithDetails = await Promise.all(users.map(async (user) => {
            let extraData = null 
            if (user.role === "STUDENT_ROLE") {
                extraData = await Student.findOne({ userId: user._id }).lean() 
            } else if (user.role === "TEACHER_ROLE") {
                extraData = await Teacher.findOne({ userId: user._id }).lean() 
            }
            return { ...user, extraData } 
        }))

        return res.status(200).json({
            success: true,
            users: usersWithDetails
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error getting users",
            error: err.message
        })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { uid } = req.params 

        const user = await User.findByIdAndUpdate(uid, { status: false }, { new: true }) 

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if (user.role === "STUDENT_ROLE") {
            await Student.findOneAndUpdate({ userId: uid }, { status: false }) 
        } else if (user.role === "TEACHER_ROLE") {
            await Teacher.findOneAndUpdate({ userId: uid }, { status: false }) 
        }

        return res.status(200).json({
            success: true,
            message: "User successfully deleted"
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error deleting user",
            error: err.message
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const { uid } = req.params
        const data = req.body

        const user = await User.findById(uid)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        if (data.role && data.role !== user.role) {
            return res.status(400).json({ success: false, message: "Role cannot be changed" })
        }

        if (data.password) {
            return res.status(400).json({ success: false, message: "Password cannot be updated here. Use the password update endpoint." })
        }

        const updatedUser = await User.findByIdAndUpdate(uid, data, { new: true })

        let extraData = null
        if (user.role === "STUDENT_ROLE") {
            const studentUpdate = {}
            if (data.coursesAssigned) {
                studentUpdate.coursesAssigned = data.coursesAssigned
            }
            if (Object.keys(studentUpdate).length > 0) {
                extraData = await Student.findOneAndUpdate({ userId: uid }, studentUpdate, { new: true })
            }
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: { ...updatedUser.toObject(), extraData },
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error updating user",
            error: err.message,
        })
    }
}


export const updatePassword = async (req, res) => {
    try {
        const { uid } = req.params 
        const { newPassword } = req.body 

        if (!newPassword) {
            return res.status(400).json({
                success: false,
                message: "New password is required"
            })
        }

        const user = await User.findById(uid)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const encryptedPassword = await bcrypt.hash(newPassword, salt)

        await User.findByIdAndUpdate(uid, { password: encryptedPassword }) 

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        }) 
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error updating password",
            error: err.message
        }) 
    }
} 


