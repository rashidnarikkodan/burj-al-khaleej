import axios from 'axios';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadToCloudinary = async (file) => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    console.error('Cloudinary config missing:', { CLOUD_NAME, UPLOAD_PRESET });
    throw new Error('Cloudinary configuration is missing in .env');
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('file', file);

  try {
    console.log('Attempting Cloudinary upload to:', url);
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.error?.message?.includes('unsigned')) {
        console.error('CRITICAL: Your Cloudinary Upload Preset "' + UPLOAD_PRESET + '" must be set to UNSIGNED in the Cloudinary dashboard Settings > Upload.');
      }
      console.error('Cloudinary API Error:', data.error?.message || data);
      throw new Error(data.error?.message || 'Upload failed');
    }

    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary Catch Error:', error.message);
    throw new Error(error.message || 'Failed to upload image');
  }
};
