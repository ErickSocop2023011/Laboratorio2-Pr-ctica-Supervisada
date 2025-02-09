import User from '../user/user.model.js';
import Course from '../course/course.model.js'
import Student from '../student/student.model.js'

export const emailExists = async (email = "") => {
    const existe = await User.findOne({ email });
    if (existe) {
        throw new Error(`Email: ${email}, is already registered`);
    }
};

export const usernameExists = async (username = "") => {
    const existe = await User.findOne({ username });
    if (existe) {
        throw new Error(`Username: ${username}, is already registered`);
    }
};

export const userExists = async (uid = "") => {
    const existe = await User.findById(uid);
    if (!existe) {
        throw new Error("The user with the entered ID does not exist");
    }
};

export const studentExists = async (userId) => {
    const student = await Student.findOne({ userId });
    if (!student) {
        throw new Error('Student not found');
    }
    return true;
}

export const courseExists = async (uid = "") => {
    const existe = await Course.findById(uid);
    if (!existe) {
        throw new Error("The course with the ID entered does not exist");
    }
}

export const teacherExists = async (userId) => {
        const teacher = await User.findById(userId);
        if (!teacher || teacher.role !== "TEACHER_ROLE") {
            throw new Error('Teacher not found');
        }
        return true;
}