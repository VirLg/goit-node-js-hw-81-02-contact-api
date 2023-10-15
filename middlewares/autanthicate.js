import jwt from 'jsonwebtoken';
import { HttpError } from '../helpers/index.js';
import User from '../models/User.js';
const { JWT_SECRET } = process.env;
const autanthicate = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    return next(HttpError(401, 'Not authorized'));
  } else {
    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      console.log('id', id);
      const user = await User.findById(id);
      if (!user) {
        throw HttpError(401, 'Not authorized');
      }
      next();
    } catch (error) {
      next(HttpError(401, 'Not authorized'));
    }
  }
};
export default autanthicate;
