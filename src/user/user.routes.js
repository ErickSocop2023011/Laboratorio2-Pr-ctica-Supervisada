import express from 'express';
import { getUserById, getUsers, deleteUser, updatePassword, updateUser} from './user.controller.js';
import { deleteUserValidator, getUserByIdValidator, updatePasswordValidator, updateUserValidator } from '../middlewares/user-validators.js';

const router = express.Router();

router.get('/findUser/:uid', getUserByIdValidator, getUserById);

router.get('/', getUsers);

router.put("/updateUser/:uid", updateUserValidator,updateUser)

router.delete('/deleteUser/:uid', deleteUserValidator, deleteUser);

router.patch('/updatePassword/:uid', updatePasswordValidator, updatePassword);

export default router;