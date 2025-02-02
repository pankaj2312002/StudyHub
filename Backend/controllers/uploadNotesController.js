

const NotesModel = require('../models/notes');




// uploade note
exports.uploadNote = async (req, res) => {
  try {
 
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

   
    const { subject, forClass, unit, semester, fileSize, documentType } = req.body;
    const uploadedBy = req.user.id;
    const fileType =  req.file.originalname.split('.')[1];
   

  
    const newNote = new NotesModel({
      subject,
      forClass,
      unit,
      semester,
      fileSize,
      fileType,
      documentType,
      file: req.file.path, 
      uploadedBy,
    });

    
    await newNote.save();

    
    return res.status(201).json({
      message: 'Note uploaded successfully!',
      newNote,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(401).json({ message: 'Internal server error.' });
  }
};







///deleteNotes

exports.deleteNote = async (req, res) => {
  try {
   


    const note = await NotesModel.findById(req.params.id);
    if (!note) {
      
      return res.status(404).json({ success: false, msg: 'Note not found or deleted before' });
    }

  
    if (note.uploadedBy.toString() !== req.user.id) {
      
      return res.status(401).json({ success: false, msg: 'Not authorized' });
    }

   
    await NotesModel.findByIdAndDelete(req.params.id);
    

  
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

