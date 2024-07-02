import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Ensure the request contains file data
    if (!req.body || !req.body.file) {
        return res.status(400).json({ error: 'No file provided' });
    }

    const { file } = req.body; // Here 'file' would be a base64 encoded string

    try {
        // Upload the image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(file, {
            folder: 'uploads'  // Specify your folder name here
        });
        res.status(200).json({ message: 'Upload successful', data: uploadResult });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed', details: error.message });
    }
}