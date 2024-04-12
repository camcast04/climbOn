// Import the cloudinary and CloudinaryStorage libraries
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Define the storage settings using CloudinaryStorage which integrates with multer for file uploads
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ClimbOn',
    allowedFormats: ['jpeg', 'png', 'jpg'],
  },
});

// Export the configured cloudinary and storage instancess
module.exports = {
  cloudinary,
  storage,
};
