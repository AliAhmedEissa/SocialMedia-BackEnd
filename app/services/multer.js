import multer from "multer";

export function uploadFile(customValidation = []) {
  const storage = multer.diskStorage({})

  function fileFilter(req, file, cb) {
    if (customValidation.includes(file.mimetype)) {
     return cb(null, true);
    } else {
      return cb(" in-valid file format", false);
    }
  }

  return multer({ fileFilter, storage });
}
