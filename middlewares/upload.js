import multer from 'multer';
import path from 'path';

const destination = path.resolve('temp');
const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniquePreffix}_${file.originalname}`);
  },
});
const limits = {
  fileSize: 5 * 1024 * 1024,
};
const upload = multer({ storage, limits });
export default upload;
