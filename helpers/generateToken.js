import jwt from 'jsonwebtoken';
import 'dotenv/config';

const generateToken = id => {
  const { JWT_SECRET } = process.env;
  const payload = { id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' });
  console.log('token', token);
  return token;
};
export default generateToken;
