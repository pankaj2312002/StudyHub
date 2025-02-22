const NotesModel = require('../models/notes');
const mongoose = require('mongoose');


  // Toggle Like/Unlike Notes
  exports.toggleLike = async (req, res) => {
    try {
        
      const NotesId = req.params.id;
      const userId = req.user.id; 
      const { liked } = req.body;  // a boolean value: ( want to like or unlike)
    
      // Check authentication
      if (!userId) {        
        return res.status(401).json({
          success: false,
          message: 'User not authenticated.'
        });
      }
  
      // Validate NotesId
      if (!mongoose.Types.ObjectId.isValid(NotesId)) {        
        return res.status(400).json({
          success: false,
          message: 'Invalid note ID.'
        });
      }
  
      // Fetch the note to check current likes
      const note = await NotesModel.findById(NotesId);

      if (!note) {        
        return res.status(404).json({
          success: false,
          message: 'Note not found.'
        });
      }

      // Toggle like/unlike logic
      // user like karna chata hai...(aur like wali array me nahi hai )
      if (liked && !note.likes.includes(userId)) {
        note.likes.push(userId);        
      }
      // user unlike karna chata hai...(aur like wali array me present hai)
      else if (!liked && note.likes.includes(userId)) {
        note.likes.pull(userId);        
      }
      else {        
        return res.status(400).json({
          success: false,
          message: liked ? 'You have already liked this note.' : 'You have not liked this note yet.'
        });
      }
  
      await note.save();

      return res.status(200).json({
        success: true,
        message: liked ? 'Note liked successfully.' : 'Note disliked successfully.',
        likes: note.likes 
      });
  
    }
    catch (error) {      
      return res.status(500).json({
        success: false,
        message: 'An error occurred while toggling the like.',
        error: error.message
      });
    }


  };
  
  
