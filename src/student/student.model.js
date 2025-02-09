import  { Schema, model } from "mongoose";

const studentSchema = Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    idCardNumber: {
        type: Number,
        required: [true, "ID Card Number is required"],
        unique: true
    },
    grade: { 
        type: String,
        enum: ["1", "2", "3", "4", "5", "6"],
        required: [true, "Grade is required"]
    },
    assignedCourses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }],
    technicalCareer: {
        type: String
    }
},
{
    versionKey: false,
    timeStamps: true
})

studentSchema.methods.toJSON = function () {
    const {__v, _id, ...estudiante } = this.toObject();
    estudiante.uid = _id;
    return estudiante;
}

export default model("Student", studentSchema)