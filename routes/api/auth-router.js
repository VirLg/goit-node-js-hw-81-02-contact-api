import express from 'express';
import { Router } from 'express';
import { ctrlWrapper, validateBody } from '../../helpers/index.js';
import controllerUser from '../../controlers/auth-controller.js';
import { isBodyEmpty, autanthicate, upload } from '../../middlewares/index.js';
import {
  userJoiSignin,
  userJoiSignup,
  userJoiResendVerify,
} from '../../models/User.js';

const joiValidateAuth = validateBody(userJoiSignup);
const joiValidateSignin = validateBody(userJoiSignin);
const joiValidateEmail = validateBody(userJoiResendVerify);

const authRouter = Router();

const {
  signup,
  signin,
  getCurrent,

  updateAvatar,
  verificationElasticEmail,
  resendEmailVerify,
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

authRouter.patch(
  '/avatars',
  upload.single('avatar'),
  autanthicate,
  ctrlWrapper(updateAvatar)
);
authRouter.get(
  '/verify/:verificationToken',
  ctrlWrapper(verificationElasticEmail)
);
authRouter.post(
  '/verify',
  isBodyEmpty,
  joiValidateEmail,
  ctrlWrapper(resendEmailVerify)
);
export default authRouter;
