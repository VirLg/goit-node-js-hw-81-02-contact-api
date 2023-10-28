import express from 'express';
import { Router } from 'express';
import { ctrlWrapper, validateBody } from '../../helpers/index.js';
import controllerUser from '../../controlers/auth-controller.js';
import { isBodyEmpty, autanthicate, upload } from '../../middlewares/index.js';
import { userJoiSignin, userJoiSignup } from '../../models/User.js';

const joiValidateAuth = validateBody(userJoiSignup);
const joiValidateSignin = validateBody(userJoiSignin);

const authRouter = Router();

const {
  signup,
  signin,
  getCurrent,
  logout,
  updateAvatar,
  verificationElasticEmail,
} = controllerUser;
authRouter.post(
  '/register',
  upload.single('urlAvatar'),
  isBodyEmpty,
  joiValidateAuth,
  ctrlWrapper(signup)
);
authRouter.post('/login', isBodyEmpty, joiValidateSignin, ctrlWrapper(signin));
authRouter.get('/current', autanthicate, ctrlWrapper(getCurrent));
authRouter.post('/logout', autanthicate, ctrlWrapper(logout));
authRouter.patch(
  '/avatars',
  upload.single('avatarURL'),
  autanthicate,
  ctrlWrapper(updateAvatar)
);
authRouter.post('/v', ctrlWrapper(verificationElasticEmail));
export default authRouter;
