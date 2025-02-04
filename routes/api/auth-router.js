import express from 'express';
import { Router } from 'express';
import { ctrlWrapper, validateBody } from '../../helpers/index.js';
import controllerUser from '../../controlers/auth-controller.js';
import { isBodyEmpty, autanthicate } from '../../middlewares/index.js';
import { userJoiSignin, userJoiSignup } from '../../models/User.js';

const joiValidateAuth = validateBody(userJoiSignup);
const joiValidateSignin = validateBody(userJoiSignin);

const authRouter = Router();

const { signup, signin, getCurrent, logout } = controllerUser;
authRouter.post('/register', isBodyEmpty, joiValidateAuth, ctrlWrapper(signup));
authRouter.post('/login', isBodyEmpty, joiValidateSignin, ctrlWrapper(signin));
authRouter.get('/current', autanthicate, ctrlWrapper(getCurrent));
authRouter.post('/logout', autanthicate, ctrlWrapper(logout));
export default authRouter;
