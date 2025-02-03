


const NotesModel = require('../models/notes');



//get all notes
exports.getNotes = async (req, res) => {
  try {
    
    const notes = await NotesModel.find()
                                  .populate('uploadedBy', 'username') 
                                  .sort({ updatedAt: -1 })
                                  .lean(); 

   
    if (!notes.length) {
      return res.status(404).json({
        success: false,
        message: "No notes found"
      });
    }

    
    res.status(200).json({
      success: true,
      notes,
      message: "Notes fetched successfully"
    });

  } catch (err) {
    console.error("Error fetching notes:", err.message);

   
    res.status(500).json({
      success: false,
      error: 'Server error while fetching notes',
      details: err.message
    });
  }
};






// getNotesBysearchQuery

exports.getNotesbyQuery = async (req, res) => {
  try {
    const { searchQuery } = req.query;

    if (!searchQuery) {
      return res.status(400).json({
        success: false,
        message: "Query parameter 'q' is required",
      });
    }

    const regex = new RegExp(searchQuery, 'i'); 

    // Find notes matching the subject
    const notesBySubject = await NotesModel.find({ subject: { $regex: regex } })
      .populate('uploadedBy', 'username') 
      .lean();

    // Find notes matching the uploader's username
    const notesByUser = await NotesModel.find()
      .populate({
        path: 'uploadedBy',
        match: { username: { $regex: regex } }, 
        select: 'username', 
      })
      .lean();

   
    const filteredNotesByUser = notesByUser.filter(note => note.uploadedBy);

  
    const finalResult = [...notesBySubject, ...filteredNotesByUser]
      .sort((a, b) => new Date(b.uploadedOn) - new Date(a.updatedAt)); 

  
    if (finalResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No notes found matching the query",
      });
    }

    res.status(200).json({
      success: true, 
      notes: finalResult,
      message: "Notes fetched successfully",
    });
    console.log("Response sent successfully");
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server error occurred while fetching notes',
      details: err.message,
    });
  }
};