import Contact from '../models/Contact.js';
import { HttpError } from '../helpers/index.js';
import fs from 'fs/promises';
import path from 'path';
import gravatar from 'gravatar';
import Jimp from 'jimp';
const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.find({ owner });
  res.json(result);
};

const getById = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const result = await Contact.findById(contactId);
    if (!result) {
      throw HttpError(404, 'Not found');
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteById = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const result = await Contact.findByIdAndDelete(contactId);
    if (!result) {
      throw HttpError(404, 'Not found');
    }
    res.json(result);
  } catch (error) {
    console.log('result', error.status);
    next(error);
  }
};

export const add = async (req, res, next) => {
  const { filename, path: oldPath } = req.file;
  const { _id: owner, email } = req.user;

  const pathAvatarTemp = oldPath;
  const pathAvatarPublic = path.resolve('public', 'avatars', filename);

  await fs.rename(pathAvatarTemp, pathAvatarPublic);
  const avatarDB = path.join('public', 'avatars', filename);
  const generatorAvatar = gravatar.url(email, {
    s: '250',
    r: 'pg',
    d: 'retro',
  });

  const createContact = await Contact.create({
    ...req.body,
    owner,
    avatar: avatarDB,
    urlAvatar: generatorAvatar,
  });
  res.status(201).json(createContact);
};

export const put = async (req, res, next) => {
  const { contactId } = req.params;

  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
    runValidators: true,
  });

  res.json(result);
};

export default { add, getAll, getById, put, deleteById };
