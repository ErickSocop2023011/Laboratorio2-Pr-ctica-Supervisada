import { Router } from "express";
import { createCourseValidator,  getCourseByIdValidator,deleteCourseValidator, getCoursesByTeacherValidator} from "../middlewares/course-validators.js";
import { createCourse,getCourseById, deleteCourse, getCourses } from "../course/course.controller.js";

const router = Router();

router.post("/createCourse", createCourseValidator, createCourse);
router.get("/findCourse/:uid", getCourseByIdValidator, getCourseById);
router.delete("/deleteCourse/:uid", deleteCourseValidator, deleteCourse);
router.get("/", getCourses);

export default router;