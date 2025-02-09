import { param} from "express-validator";
import mongoose from "mongoose";
import { studentExists } from "../helpers/db-validators.js"
import { validateFields } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";

export const getStudentIdValidator = [
    param("userId")
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("not a valid MongoDB ID");
            }
            return true;
        }),
    param("userId").custom(studentExists),
    validateFields,
    handleErrors
];