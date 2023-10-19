import Contact from '../models/Contact.js';
import { HttpError } from '../helpers/index.js';
import fs from 'fs/promises';
import path from 'path';

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
  const { file } = req;
  const pathAvatarTemp = file.path;
  const pathAvatarPublic = path.resolve('public', 'avatars', file.filename);

  await fs.rename(pathAvatarTemp, pathAvatarPublic);
  const avatarDB = path.join('public', 'avatars', file.filename);
  const { _id: owner } = req.user;
  const createContact = await Contact.create({
    ...req.body,
    owner,
    avatar: avatarDB,
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
