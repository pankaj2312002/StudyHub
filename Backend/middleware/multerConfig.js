

const multer = require('multer');

// Use memory storage instead of disk storage for serverless environment
const storage = multer.memoryStorage(); // Store file in memory


// Configure multer with storage, file size limits, and file type filters
const upload = multer({
  
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    // Accept only PDF, DOC, and DOCX file types
    
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      cb(null, true); // Accept the file
    } else {
      
      cb(new Error('Only PDF and DOC/DOCX files are allowed.'), false); // Reject the file
    }
  }
});

module.exports = upload;