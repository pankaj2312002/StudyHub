const NotesModel = require('../models/notes');
const mongoose = require('mongoose');



// Toggle Like/Unlike Notes
exports.toggleLike = async (req, res) => {
    try {
      console.log('Debug: Entered toggleLike function');
  
      const NotesId = req.params.id;
      const userId = req.user.id; 
      const { liked } = req.body;
  
      console.log('Debug: Retrieved IDs', { NotesId, userId, liked });
  
      // Check authentication
      if (!userId) {
        console.log('Debug: User not authenticated');
        return res.status(401).json({
          success: false,
          message: 'User not authenticated.'
        });
      }
  
      // Validate NotesId
      if (!mongoose.Types.ObjectId.isValid(NotesId)) {
        console.log('Debug: Invalid note ID');
        return res.status(400).json({
          success: false,
          message: 'Invalid note ID.'
        });
      }
  
      // Fetch the note to check current likes
      const note = await NotesModel.findById(NotesId);
      if (!note) {
        console.log('Debug: Note not found');
        return res.status(404).json({
          success: false,
          message: 'Note not found.'
        });
      }
  
      console.log('Debug: Current likes before toggling', note.likes);
  
      // Toggle like/unlike logic
      if (liked && !note.likes.includes(userId)) {
        note.likes.push(userId);
        console.log('Debug: Note liked, updated likes', note.likes);
      } else if (!liked && note.likes.includes(userId)) {
        note.likes.pull(userId);
        console.log('Debug: Note disliked, updated likes', note.likes);
      }
       else {
        console.log('Debug: Action already performed');
        return res.status(400).json({
          success: false,
          message: liked ? 'You have already liked this note.' : 'You have not liked this note yet.'
        });
      }
  
      await note.save();
      console.log('Debug: Note saved successfully');
  
    
      return res.status(200).json({
        success: true,
        message: liked ? 'Note liked successfully.' : 'Note disliked successfully.',
        likes: note.likes 
      });
  
    } catch (error) {
      console.error('Error toggling like:', error.message);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while toggling the like.',
        error: error.message
      });
    }
  };
  
  