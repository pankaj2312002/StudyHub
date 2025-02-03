const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  subject: { 
    type: String, 
    required: true 
  },
  forClass: { 
    type: String, 
    required: true 
  },
  unit: { 
    type: Number, 
    required: true 
  },
  semester: { 
    type: Number, 
    required: true 
  },
  fileSize: { 
    type: Number, 
    required: true 
  },
  fileType: { 
    type: String, 
    required: true 
  },
  file: {
    type: String, // URL or path of the uploaded file
    required: true 
  },
  documentType:{
    type: String, 
    required: true 
  },
  uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);