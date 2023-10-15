import bcrypt from 'bcrypt';

const validateHashPassword = async password => {
  const hashPassword = await bcrypt.hash(password, 10);
  return hashPassword;
};
export default validateHashPassword;
