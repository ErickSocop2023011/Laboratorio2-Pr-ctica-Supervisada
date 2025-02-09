import mongoose from "mongoose"
import Course from "../course/course.model.js"
import User from "../user/user.model.js"
import Student from "../student/student.model.js"
import Teacher from "../teacher/teacher.model.js"

export const createCourse = async (req, res) => {
    try {
        const { teacherId, name, description, schedule, level } = req.body

        const teacher = await User.findById(teacherId)
        if (!teacher || teacher.role !== "TEACHER_ROLE") {
            return res.status(403).json({ message: "Only teachers can create courses" })
        }

        const newCourse = new Course({ name, description, teacherId, schedule, level })
        await User.findByIdAndUpdate(
            teacherId,
            { $push: { courses: newCourse._id } }
        )
        await newCourse.save()

        return res.status(201).json({ message: "Course created successfully", course: newCourse })
    } catch (err) {
        return res.status(500).json({ message: "Error creating course", error: err.message })
    }
}

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({ active: true })
            .populate("teacherId", "userId department") 

        return res.status(200).json({
            message: "Lista de cursos obtenida exitosamente",
            courses
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener los cursos",
            error: error.message
        })
    }
}

export const updateCourse = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const { uid, name, description, schedule, level } = req.body;

        if (!mongoose.Types.ObjectId.isValid(teacherId)) {
            return res.status(400).json({ message: "ID de profesor no válido" });
        }

        const teacher = await User.findById(teacherId);
        if (!teacher || teacher.role !== "TEACHER_ROLE") {
            return res.status(403).json({ message: "Solo los profesores pueden actualizar cursos" });
        }

        const updateFields = {...(name && { name }), ...(description && { description }),...(schedule && { schedule }),...(level && { level })};

        const updatedCourse = await Course.findByIdAndUpdate(uid, updateFields, { new: true });

        return res.status(200).json({ message: "Curso actualizado correctamente", course: updatedCourse });
    } catch (err) {
        return res.status(500).json({ message: "Error al actualizar el curso", error: err.message });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const { uid } = req.params

        if (!mongoose.Types.ObjectId.isValid(uid)) {
            return res.status(400).json({ message: "ID de curso no válido" })
        }

        const updatedCourse = await Course.findByIdAndUpdate(uid,{status: false, studentCount: 0 },  { new: true })

        if (!updatedCourse) {
            console.log("Course not found")
            return res.status(404).json({ message: "Curso no encontrado" })
        }

        await Student.updateMany({ assignedCourses: uid },{ $pull: { assignedCourses: uid } })

        await Teacher.findOneAndUpdate({ userId: updatedCourse.teacherId }, { $pull: { courses: uid } })

        return res.status(200).json({
            message: "Curso eliminado correctamente (soft delete)",
            course: updatedCourse
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar el curso",
            error: error.message
        })
    }
}
export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params
        const course = await Course.findById(id).populate("teacher", "userId department")

        if (!course) {
            return res.status(404).json({
                msg: `Course with ID ${id} not found`
            })
        }

        res.json(course)
    } catch (error) {
        console.error("Error getting course by ID:", error)
        res.status(500).json({
            msg: "An error occurred while retrieving the course"
        })
    }
}



