import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'node:fs/promises';

dotenv.config();

cloudinary.v2.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function saveFileToCloudinary(file) {
  const res = await cloudinary.v2.uploader.upload(file.path);
  console.log(file.path);
  await fs.unlink(file.path);
  return res.secure_url;
}
