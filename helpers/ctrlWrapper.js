const ctrlWrapper = ctrl => {
  const func = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
      console.log('ctrl', req);
    } catch (error) {
      console.log('errorCTR', error);
      next(error);
    }
  };
  console.log('ctrl', 'req');
  return func;
};
export default ctrlWrapper;
