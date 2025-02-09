import { body, param } from "express-validator"
import { validateFields } from "./validate-fields.js"
import { handleErrors } from "./handle-errors.js"
import { courseExists, teacherExists } from "../helpers/db-validators.js"

export const createCourseValidator = [
    body("name").notEmpty().withMessage("The course name is required"),
    body("name").isString().withMessage("The course name must be a string"),
    body("description").optional().isString().withMessage("The description must be a string"),
    body("teacherId").notEmpty().withMessage("The teacher ID is required"),
    body("teacherId").isMongoId().withMessage("Not a valid MongoDB ID"),
    body("teacherId").custom(teacherExists),
    body("schedule").isArray({ min: 1 }).withMessage("The schedule must be an array with at least one item"),
    body("schedule.*.day").notEmpty().withMessage("The day is required"),
    body("schedule.*.day").isString().withMessage("The day must be a string"),
    body("schedule.*.time").notEmpty().withMessage("The time is required"),
    body("schedule.*.time").isString().withMessage("The time must be a string"),
    body("level").notEmpty().withMessage("The level is required"),
    body("level").isString().withMessage("The level must be a string"),
    validateFields,
    handleErrors
]


export const updateCourseValidator = [
    param("uid").isMongoId().withMessage("Not a valid MongoDB ID"),
    param("uid").custom(courseExists),
    body("name").optional().isString().withMessage("The course name must be a string"),
    body("description").optional().isString().withMessage("The description must be a string"),
    body("teacherId").optional().isMongoId().withMessage("Not a valid MongoDB ID"),
    body("teacherId").optional().custom(teacherExists),
    body("schedule").optional().isArray().withMessage("The schedule must be an array"),
    body("schedule.*.day").optional().isString().withMessage("The day must be a string"),
    body("schedule.*.time").optional().isString().withMessage("The time must be a string"),
    body("level").optional().isString().withMessage("The level must be a string"),
    validateFields,
    handleErrors
]

export const getCourseByIdValidator = [
    param("uid").isMongoId().withMessage("Not a valid MongoDB ID"),
    param("uid").custom(courseExists),
    validateFields,
    handleErrors
]

export const deleteCourseValidator = [
    param("uid").isMongoId().withMessage("Not a valid MongoDB ID"),
    param("uid").custom(courseExists),
    validateFields,
    handleErrors
]


export const getCoursesByTeacherValidator = [
    param("teacherId").isMongoId().withMessage("Not a valid MongoDB ID"),
    param("teacherId").custom(teacherExists),
    validateFields,
    handleErrors
]
