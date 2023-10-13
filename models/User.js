import Joi from 'joi';
import { Schema, model } from 'mongoose';

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);
const User = model('user', userSchema);
export default User;

export const userJoiSignin = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().emailemailRegexp.required(),
  password: Joi.string().min(6).required(),
});
