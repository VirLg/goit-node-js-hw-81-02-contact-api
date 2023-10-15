import User, { userJoiSignin } from '../models/User.js';
import { HttpError } from '../helpers/index.js';
import bcrypt from 'bcrypt';
const signup = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, `${email} in use `);
  } else {
    const hasPAssword = await bcrypt.hash(password, 10);
    const createUser = await User.create({
      ...req.body,
      password: hasPAssword,
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

  if (user) {
    const passCompare = bcrypt.compare(password, user.password);
    res.status(200).json({
      email: user.email,
    });
    if (!passCompare) {
      throw HttpError(401, 'Email or password is wrong');
    } else {
    }
  }
  throw HttpError(401, 'Email or password is wrong');
};
export default { signup, signin };
