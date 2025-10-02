import cloudinary from '../config/config';

export async function uploadToCloudinary(buffer, mimetype) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: mimetype.startsWith('video/') ? 'video' : 'auto',
        folder: mimetype.startsWith('video/') ? 'videos' : 'files',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });
}