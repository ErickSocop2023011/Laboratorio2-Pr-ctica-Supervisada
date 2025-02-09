import { Schema,model } from "mongoose";


const teacherSchema = Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    department: {
        type: String,
        required: true
    },
},
{
    versionKey: false,
    timeStamps: true
})

teacherSchema.methods.toJSON = function () {
    const { __v, _id, ...profesor } = this.toObject();
    profesor.uid = _id;
    return profesor;
}

export default model("Teacher", teacherSchema)
