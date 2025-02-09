import mongoose, { Schema, model } from "mongoose";

const courseSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true
    },
    studentCount:{
        type: Number,
        default: 0
    },
    teacherId:[{type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    schedule: [{
        day: { 
            type: String, 
            required: true
        }, 
        time: {
            type: String,
            required: true
        }
    }],
    level: {
        type: String,
        enum: ["1", "2", "3", "4", "5", "6"],
        required: [true, "Grade is required"]
    },
    status: {
        type: Boolean,
        default: true
    }
},
{
    versionKey: false,
    timeStamps: true
});

courseSchema.methods.toJSON = function(){
    const {__v, _id, ...curso} = this.toObject()
        curso.uid = _id
        return curso
}

export default model('Course', courseSchema)