import { Router } from "express"
import { getTeachers, getCoursesByTeacher } from "./teacher.controller.js"
import { getTeacherIdValidator } from "../middlewares/teacher-validator.js"
import { updateCourseValidator } from "../middlewares/course-validators.js"
import { updateCourse } from "../course/course.controller.js"

const router = Router()

router.get("/", getTeachers)
router.get("/findCourses/:userId", getTeacherIdValidator, getCoursesByTeacher)
router.put("/updateCourse/:userId", updateCourseValidator, updateCourse);
export default router