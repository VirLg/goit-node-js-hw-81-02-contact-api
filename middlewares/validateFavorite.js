import { HttpError } from '../helpers/index.js';
const validateFavotite = updateFavoriteShema => {
  const func = (req, res, next) => {
    const { error } = updateFavoriteShema.validate(req.body);
    if (error) {
      return next(HttpError(400, `missing field ${error.details[0].path} `));
    }
    next();
  };
  return func;
};
export default validateFavotite;
