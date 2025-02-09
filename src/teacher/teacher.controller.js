import mongoose from "mongoose"
import User from "../user/user.model.js"
import Teacher from "../teacher/teacher.model.js"
import Course from '../course/course.model.js'

export const getTeachers = async (req, res) => {
    try {
        const { limite = 5, desde = 0 } = req.query
        const query = { status: true, role: "TEACHER_ROLE" }

        const users = await User.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .lean()

        const teachersWithDetails = await Promise.all(users.map(async (user) => {
            const extraData = await Teacher.findOne({ userId: user._id }).lean()
            return { ...user, extraData }
        }))

        return res.status(200).json({
            success: true,
            teachers: teachersWithDetails
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error getting teachers",
            error: err.message
        })
    }
}

export const getCoursesByTeacher = async (req, res) => {
    try {
        const { userId } = req.params


        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "ID de Profesor no válido" })
        }

        
        const courses = await Course.find({ teacherId: userId })
        
        console.log(`Courses found: ${courses.length}`)
        
        if (courses.length === 0) {
            return res.status(404).json({ message: "No se encontraron cursos para este profesor" })
        }

        return res.status(200).json({
            message: "Cursos encontrados correctamente",
            courses
        })

    } catch (error) {
        console.error("Error retrieving courses by teacher:", error)
        return res.status(500).json({
            message: "Error al obtener los cursos",
            error: error.message
        })
    }
}


export const updateCourse = async (req, res) => {
    try {
        const { uid } = req.params; // ID del curso en la URL
        const { teacherId, name, description, schedule, level } = req.body; // teacherId en el cuerpo de la solicitud

        if (!mongoose.Types.ObjectId.isValid(uid)) {
            return res.status(400).json({ message: "ID de curso no válido" });
        }

        if (!mongoose.Types.ObjectId.isValid(teacherId)) {
            return res.status(400).json({ message: "ID de profesor no válido" });
        }

        const teacher = await User.findById(teacherId);
        if (!teacher || teacher.role !== "TEACHER_ROLE") {
            return res.status(403).json({ message: "Solo los profesores pueden actualizar cursos" });
        }

        const updateFields = {
            ...(name && { name }),
            ...(description && { description }),
            ...(schedule && { schedule }),
            ...(level && { level })
        };

        const updatedCourse = await Course.findByIdAndUpdate(uid, updateFields, { new: true });

        if (!updatedCourse) {
            return res.status(404).json({ message: "El curso con el ID ingresado no existe" });
        }

        return res.status(200).json({ message: "Curso actualizado correctamente", course: updatedCourse });
    } catch (err) {
        return res.status(500).json({ message: "Error al actualizar el curso", error: err.message });
    }
}