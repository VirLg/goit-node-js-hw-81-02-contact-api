import User, { userJoiSignin } from '../models/User.js';
import bcrypt from 'bcrypt';
import {
  HttpError,
  validateHashPassword,
  generateToken,
} from '../helpers/index.js';

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, `${email} in use `);
  } else {
    const hashPassword = await validateHashPassword(password);
    const createUser = await User.create({
      ...req.body,
      password: hashPassword,
    });
    res.status(201).json({
      email: createUser.email,
      subscription: 'starter',
    });
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  } else {
    const passCompare = await bcrypt.compare(password, user.password);
    console.log('passCompare', passCompare);
    if (!passCompare) {
      throw HttpError(401, 'Email or password is wrong');
    } else {
      const token = generateToken(user._id);
      await User.findByIdAndUpdate(user._id, { token });

      res.status(200).json({ token });
    }
  }
};

const getCurrent = (req, res, next) => {
  const { email, subscription } = req.body;
  res.status(200).json({
    email,
    subscription,
  });
};
const logout = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { token: '' });
};
export default { signup, signin, getCurrent, logout };
