import express from 'express';
import { Router } from 'express';
import controllerUser from '../../controlers/auth-controller.js';
import ctrlWrapper from '../../helpers/ctrlWrapper.js';
import userSchema, { userJoiSignin, userJoiSignup } from '../../models/User.js';

const authRouter = Router();
const { signup } = controllerUser;
authRouter.post('/register', ctrlWrapper(signup));
export default authRouter;
