import { FileData } from './types';

const CLOUDINARY_CLOUD_NAME = 'dxyp1p0wy';
const CLOUDINARY_UPLOAD_PRESET = 'webora_unsigned'; // Θα το φτιάξουμε στο επόμενο βήμα

export const uploadToCloudinary = async (file: FileData): Promise<string | null> => {
  try {
    const formData = new FormData();
    
    // Convert base64 to blob
    const response = await fetch(file.base64);
    const blob = await response.blob();
    
    formData.append('file', blob, file.name);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await uploadResponse.json();
    
    if (data.secure_url) {
      console.log('✅ Image uploaded:', data.secure_url);
      return data.secure_url;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Cloudinary upload failed:', error);
    return null;
  }
};

export const uploadMultipleImages = async (files: FileData[]): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadToCloudinary(file));
  const results = await Promise.all(uploadPromises);
  return results.filter((url): url is string => url !== null);
};