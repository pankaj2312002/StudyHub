const multer = require('multer');


// Use memory storage instead of disk storage for serverless environment
const storage = multer.memoryStorage(); // Store file in memory

// Configure multer with storage, file size limits, and file type filters
const upload = multer({  
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    // cb -->> stands for callback (used to control whether a file should be accepted or rejected during the upload process.)
    // Accept only PDF, DOC, and DOCX file types  
    if ( file.mimetype === 'application/pdf' ||
         file.mimetype === 'application/msword' ||
         file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true); // Accept the file
    } 
    else {  
      cb(new Error('Only PDF and DOC/DOCX files are allowed.'), false); // Reject the file
    }
  }
});

module.exports = upload;

// Multer Middleware req.file ko inject karta hai request me.
// Agar storage memoryStorage() hai, toh file buffer me store hoti hai.
// Agar storage diskStorage() hai, toh file uploads folder me store hoti hai aur req.file.path me milti hai.


// Jab koi file upload hoti hai, req.file me following properties hoti hain :
// {
//   fieldname: 'file', // Input field ka naam (frontend ya Postman se)
//   originalname: 'example.pdf', // Jo file ka actual naam hai
//   encoding: '7bit', // Encoding type (zyadatar '7bit' hota hai)
//   mimetype: 'application/pdf', // File ka MIME type
//   size: 102400, // File ka size (bytes me)
//   buffer: <Buffer 25 50 44 46 2d 31 2e ... >, // File ka actual data (binary format me)
// }
