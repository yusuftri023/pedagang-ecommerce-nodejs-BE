import multer from "multer";

export const imageUpload = multer({
  limits: { fileSize: 1024 * 500 },
  fileFilter: (req, file, callback) => {
    const allowedMimeType = ["image/jpeg", "image/jpg", "image/png"];

    if (allowedMimeType.includes(file.mimetype)) {
      callback(null, true);
    } else {
      const err = new Error(
        `Only ${allowedMimeType.join(", ")} allowed to upload`
      );
      callback(err, false);
    }
  },
  onError: (err, next) => {
    next(err);
  },
});
