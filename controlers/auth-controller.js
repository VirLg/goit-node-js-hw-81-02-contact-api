import gravatar from 'gravatar';
import path from 'path';
import fs from 'fs/promises';
import Jimp from 'jimp';
import bcrypt from 'bcrypt';
import User, { userJoiSignin } from '../models/User.js';

import {
  HttpError,
  validateHashPassword,
  generateToken,
} from '../helpers/index.js';

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  // const avatarDB = path.join('public', 'avatars', filename);
  const generatorAvatar = gravatar.url(email, {
    s: '250',
    r: 'pg',
    d: 'retro',
  });

  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, `${email} in use `);
  } else {
    const hashPassword = await validateHashPassword(password);
    const createUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL: generatorAvatar,
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
  const resp = await User.findOne({ email: email });
  res.status(200).json({
    email: user.email,
    subscription: user.subscription,
  });
};

const logout = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { token: '' });
  res.status(204).json({});
};

const updateAvatar = async (req, res, next) => {
  const { filename } = req.file;
  const image = await Jimp.read(`temp/${filename}`);

  await image.resize(250, 250);
  const a = await image.writeAsync(`public/avatars/${filename}`);

  const pathAvatar = path.join('public', 'avatars', filename);
  const result = await User.findByIdAndUpdate(req.user._id, {
    avatarURL: pathAvatar,
  });

  res.json({ avatarURL: result.avatarURL });
};
export default { signup, signin, getCurrent, logout, updateAvatar };
