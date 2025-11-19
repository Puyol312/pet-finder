// config.ts
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 8080;
const SECRET = process.env.SECRETWORD!;
const API_KEY = process.env.API_KEY!;
const APP_ID = process.env.APP_ID!;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY!;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET!;
const RESEND_API_KEY = process.env.RESEND_API_KEY!;

if (!SECRET) throw new Error("Missing SECRETWORD");
if (!API_KEY) throw new Error("Missing API_KEY");
if (!APP_ID) throw new Error("Missing APP_ID");
if (!CLOUDINARY_CLOUD_NAME) throw new Error("Missing CLOUDINARY_CLOUD_NAME");
if (!CLOUDINARY_API_KEY) throw new Error("Missing CLOUDINARY_API_KEY");
if (!CLOUDINARY_API_SECRET) throw new Error("Missing CLOUDINARY_API_SECRET");
if (!RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY");

export {
  SECRET,
  PORT,
  API_KEY,
  APP_ID,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  RESEND_API_KEY
};