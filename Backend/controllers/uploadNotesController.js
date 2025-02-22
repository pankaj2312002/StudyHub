

const NotesModel = require('../models/notes');
const { uploadOnCloudinary } = require("../utilityFiles/cloudinaryUtils");
const { deleteFromCloudinary, extractPublicIdFromUrl } = require("../utilityFiles/cloudinaryUtils");


// uploade note
exports.uploadNote = async (req, res) => {
  try {

    if (!req.file) {  
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    
    const { subject, forClass, unit, semester, fileSize, documentType } = req.body;
    const uploadedBy = req.user?.id;
    const fileType = req.file?.originalname.split('.')[1];
   
    // Pass the buffer directly to Cloudinary for upload
    const cloudinaryResponse = await uploadOnCloudinary(req.file.buffer, req.file.originalname); // Change to req.file.buffer
    
    if (!cloudinaryResponse) { 
      return res.status(500).json({ message: 'File upload to Cloudinary failed.' });
    }

    // Ab cloudinary se url leke apne ko DB me save karwana hai...
    const fileUrl = cloudinaryResponse.url;
    
    let modifiedFileUrl = fileUrl;

    if (fileType === 'pdf') {
      // If PDF, return the direct URL
      console.log("Directly open PDF:", fileUrl);
    } else {
      // For non-PDF files, use Google Docs Viewer
      modifiedFileUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;      
    }
   
    // Now create entry in DB...
    const newNote = new NotesModel({
      subject,
      forClass,
      unit,
      semester,
      fileSize,
      fileType,
      documentType,
      file: modifiedFileUrl, // Save Cloudinary URL in DB
      uploadedBy,
    });

    await newNote.save();
    
    // send response
    return res.status(201).json({
      message: 'Note uploaded successfully!',
      newNote,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};







///deleteNotes

exports.deleteNote = async (req, res) => {

  try {

    const noteId =  req.params.id

    const note = await NotesModel.findById(noteId);

    // Agar particular note DB me available hi na ho...
    if (!note) {      
      return res.status(404).json({ success: false, msg: 'Note not found or deleted before' });
    }

    // If that particular note is not uploaded by requesting user...
    if (note.uploadedBy.toString() !== req.user.id) {      
      return res.status(401).json({ success: false, msg: 'Not authorized' });
    }
   
  // DB se particular note ka URL nikal lete hai...
  // And us URL se publicId nikal lenge...
   const publicId = extractPublicIdFromUrl(note.file);

   console.log("publicId of file =>", publicId)
    if (!publicId) {
      return res.status(500).json({ success: false, msg: 'Error extracting file ID' });
    }

    // Noe delete from cloudinary
    const deleteResponse = await deleteFromCloudinary(publicId);

    console.log("deleteResponse =>", deleteResponse)
    if (!deleteResponse) {
      return res.status(500).json({ success: false, msg: 'Failed to delete file from Cloudinary' });
    } 

    // Now , delete from database
    await NotesModel.findByIdAndDelete(noteId);
    console.log("succesfully delete from db")
    
    // send response...
    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (err) {
  
    res.status(500).json({
      success: false,
      error: 'Server error at deleting note',
    });
  }
};