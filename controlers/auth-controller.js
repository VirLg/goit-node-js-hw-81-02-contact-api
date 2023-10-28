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
  elasticemail,
} from '../helpers/index.js';
import { nanoid } from 'nanoid';

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  const verificationToken = nanoid();
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
      verificationToken,
    });
    elasticemail({
      to: 'rocav44797@soebing.com',
      sendBody: `<a target="blank" href="localhost:3000/api/users/verify/${verificationToken}">Hello, this verification link</a>`,
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
  const { token } = req.user.token;
  const user = await User.findOne(token);
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

const verificationElasticEmail = async () => {
  const a = await User.findOne(verificationToken);
};
export default {
  signup,
  signin,
  getCurrent,
  logout,
  updateAvatar,
  verificationElasticEmail,
};
