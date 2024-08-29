import multer from 'multer';
import { ApiError } from '../utils/apiError.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + '-' + uniqueSuffix);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('images/')) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Images only allowed'), false);
  }
};

export const upload = multer({ storage, fileFilter });
