
const { cloudinary } = require("../config/cloudinary");

const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-zA-Z0-9-_\.]/g, '_'); 
};

const uploadOnCloudinary = (fileBuffer, filename) => {

  return new Promise((resolve, reject) => {
    const sanitizedFilename = sanitizeFilename(filename);
    
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw', 
        folder: 'NotesPdf',
        
        public_id: sanitizedFilename,
      },
      (error, result) => {
        if (error) {
          
          reject(error);
        } else {
          
          resolve(result);
        }
      }
    ).end(fileBuffer); 
  });
};


const deleteFromCloudinary = async (publicId) => {
 
  try {
    if (!publicId) {
      console.error("publicId is not found!");
      return false;
    }

  
    const response = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    

    if (response.result !== 'ok' ) {
      console.error("Failed to delete file from Cloudinary");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error.message);
    return false;
  }
};



const extractPublicIdFromUrl = (url) => {
  try {
    let publicId = null;

    if (url.includes("docs.google.com/gview")) {
      
      const urlParams = new URLSearchParams(new URL(url).search);
      const embeddedUrl = urlParams.get("url");
      
      if (embeddedUrl) {
       
        url = decodeURIComponent(embeddedUrl);
      }
    }

    // Handle Cloudinary URLs
    const parts = url.split('/');
    const encodedFileName = parts[parts.length - 1]; 
    const decodedFileName = decodeURIComponent(encodedFileName); 
    const fileFolder = decodeURIComponent(parts[parts.length - 2]); 

    // Construct the public_id
    publicId = `${fileFolder}/${decodedFileName}`;

  
    return publicId;
  } catch (error) {
    console.error("Error extracting public ID from URL:", error.message);
    return null;
  }
};


module.exports = { 
  uploadOnCloudinary,
  deleteFromCloudinary,
  extractPublicIdFromUrl
};