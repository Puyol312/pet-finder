import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export function multerMiddleware(fieldName: string) {
  return upload.single(fieldName);
}