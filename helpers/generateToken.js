import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { HttpError } from './index.js';
const generateToken = id => {
  try {
    const { JWT_SECRET } = process.env;
    const payload = { id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' });

    return token;
  } catch (error) {
    console.log('errorGen', error);
    next(error);
  }
};
export default generateToken;
