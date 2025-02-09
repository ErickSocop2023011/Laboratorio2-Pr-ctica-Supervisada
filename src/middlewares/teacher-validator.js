import { param } from "express-validator";
import mongoose from "mongoose";
import { handleErrors } from "./handle-errors.js";
import { validateFields } from "./validate-fields.js";
import { teacherExists } from "../helpers/db-validators.js";

export const getTeacherIdValidator = [
    param("userId")
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("not a valid MongoDB ID");
            }
            return true;
        }),
    param("userId").custom(teacherExists),
    validateFields,
    handleErrors
];