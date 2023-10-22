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
    if (!passCompare) {
      throw HttpError(401, 'Email or password is wrong');
    } else {
      const token = generateToken(user._id);
      await User.findByIdAndUpdate(user._id, { token });

      res.status(200).json({
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    }
  }
};

const getCurrent = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  res.status(200).json({
    email: user.email,
    subscription: user.subscription,
  });
};

const logout = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { token: '' });
  res.status(204).json({});
};
export default { signup, signin, getCurrent, logout };
