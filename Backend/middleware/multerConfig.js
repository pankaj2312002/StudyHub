const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'NotesPdf', // Optional: specify a folder in Cloudinary
    allowed_formats: ['pdf', 'doc', 'docx'], // Allowed file formats
    resource_type: 'raw', // Use 'raw' for non-image files
    public_id: (req, file) => {
      // Use the original file name without the extension
      const fileNameWithoutExtension = file.originalname.split('.')[0];
      // Get the file extension
      const fileExtension = file.originalname.split('.').pop();
      return `${fileNameWithoutExtension}-${Date.now()}.${fileExtension}`; // Maintain original extension
    },
  },
});

// Set up Multer with Cloudinary storage
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    // Accept only PDF, DOC, and DOCX file types
    if (file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Only PDF and DOC/DOCX files are allowed.'), false); // Reject the file
    }
  },
});

module.exports = upload;
