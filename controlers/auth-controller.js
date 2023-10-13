import User from '../models/User.js';
import { HttpError } from '../helpers/index.js';

const signup = async (req, res, next) => {
  const createUser = await User.create(req.body);
  res.status(201).json(createUser);
};

export default { signup };
