// pages/api/upload.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'YOUR_CLOUD_NAME',
  api_key: 'YOUR_API_KEY',
  api_secret: 'YOUR_API_SECRET'
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { file } = req.body;
      const result = await cloudinary.uploader.upload(file, {
        upload_preset: 'YOUR_UPLOAD_PRESET'
      });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Upload failed' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
