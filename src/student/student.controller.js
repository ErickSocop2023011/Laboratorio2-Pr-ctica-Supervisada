import mongoose from "mongoose"
import User from "../user/user.model.js"
import Student from "../student/student.model.js"
import Course from "../course/course.model.js"

export const getStudents = async (req, res) => {
    try {
        const { limite = 5, desde = 0 } = req.query
        const query = { status: true, role: "STUDENT_ROLE" }

        const users = await User.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .lean()

        const studentsWithDetails = await Promise.all(users.map(async (user) => {
            const extraData = await Student.findOne({ userId: user._id }).lean()
            if (extraData) {
                const courses = await Course.find({ _id: { $in: extraData.assignedCourses } }).lean()
                extraData.assignedCourses = courses
            }
            return { ...user, extraData }
        }))

        return res.status(200).json({
            success: true,
            students: studentsWithDetails
        })
    } catch (err) {
        console.error("Error getting students:", err)
        return res.status(500).json({
            success: false,
            message: "Error getting students",
            error: err.message
        })
    }
}


export const assignCourse = async (req, res, next) => {
    try {
        const { userId } = req.params
        const { courseId } = req.body

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: "ID de curso no válido" })
        }

        const student = await Student.findOne({ userId })
        if (!student) {
            return res.status(404).json({ message: "Estudiante no encontrado" })
        }

        const course = await Course.findById(courseId)
        
        if (!course) {
            return res.status(404).json({ message: "Curso no encontrado" })
        }

        if (!course.status) { 
            return res.status(404).json({ message: "Curso inactivo" })
        }

        if (student.assignedCourses.length >= 3) {
            return res.status(400).json({ message: "El estudiante ya tiene 3 cursos asignados" })
        }

        if (student.assignedCourses.includes(courseId)) {
            return res.status(400).json({ message: "El estudiante ya está asignado a este curso" })
        }

        student.assignedCourses.push(courseId)
        await student.save()

        await Course.findByIdAndUpdate(courseId, { $inc: { studentCount: 1 } })

        const updatedCourse = await Course.findById(courseId).lean()

        return res.status(200).json({ message: "Curso asignado correctamente", student, course: updatedCourse })

    } catch (error) {
        console.error("Error assigning course:", error)
        next(error) 
    }
}

export const removeCourse = async (req, res) => {
    try {
        const { userId, assignedCourses } = req.params

        if (!mongoose.Types.ObjectId.isValid(assignedCourses)) {
            return res.status(400).json({ message: "ID de curso no válido" })
        }

        const student = await Student.findById({userId})
        if (!student) {
            return res.status(404).json({ message: "Estudiante no encontrado" })
        }

        if (!student.assignedCourses.includes(assignedCourses)) {
            return res.status(400).json({ message: "El estudiante no está asignado a este curso" })
        }

        student.assignedCourses = student.assignedCourses.filter(id => id.toString() !== assignedCourses)
        await student.save()

        await Course.findByIdAndUpdate(assignedCourses, { $inc: { studentCount: -1 } })

        return res.status(200).json({ message: "Curso desasignado correctamente", student })

    } catch (error) {
        return res.status(500).json({ message: "Error al desasignar curso", error: error.message })
    }
}

export const getCoursesByStudent = async (req, res) => {
    try {
        const { userId } = req.params; 
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "ID de estudiante no válido" });
        }
        
        const student = await Student.findOne({ userId }).populate('assignedCourses');

        if (!student) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }

        const courses = student.assignedCourses;
        
        if (courses.length === 0) {
            return res.status(404).json({ message: "No se encontraron cursos para este estudiante" });
        }

        return res.status(200).json({
            message: "Cursos encontrados correctamente",
            courses
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener los cursos",
            error: error.message
        });
    }
};