import { Router } from "express"
import { assignCourse, getStudents, removeCourse, getCoursesByStudent } from "./student.controller.js"
import { deleteUserValidator } from "../middlewares/user-validators.js"
import { getStudentIdValidator } from "../middlewares/student-validators.js"

const router = Router()

router.get("/", getStudents)
router.patch("/assignCourse/:userId", getStudentIdValidator ,assignCourse)
router.delete("/removeCourse/:userId",deleteUserValidator, removeCourse )
router.get("/findCourses/:userId", getStudentIdValidator, getCoursesByStudent)

export default router