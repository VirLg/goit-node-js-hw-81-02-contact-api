import express from 'express';
import { Router } from 'express';
import controllerUser from '../../controlers/auth-controller.js';
import ctrlWrapper from '../../helpers/ctrlWrapper.js';
// import userSchema, { userJoiSignin, userJoiSignup } from '../../models/User.js';
import isBodyEmpty from '../../middlewares/isBodyEmpty.js';
import validateBody from '../../helpers/validateBody.js';
import { userJoiSignin, userJoiSignup } from '../../models/User.js';

const joiValidateAuth = validateBody(userJoiSignup);
const joiValidateSignin = validateBody(userJoiSignin);

const authRouter = Router();

const { signup, signin } = controllerUser;
authRouter.post('/register', isBodyEmpty, joiValidateAuth, ctrlWrapper(signup));
authRouter.post('/login', isBodyEmpty, joiValidateSignin, ctrlWrapper(signin));
export default authRouter;
