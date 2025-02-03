


import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetUploadState, uploadNote } from '../redux/Slices/UploadNotesSlice';
import { fetchNotes } from '../redux/Slices/Notesslice';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-hot-toast'; 
const MAX_FILE_SIZE = 10 * 1024 * 1024; 

const UploadNotes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, success, error } = useSelector((state) => state.uploadNotes); 

  const [formData, setFormData] = useState({
    subject: '',
    forClass: '',
    unit: '',
    semester: '',
    fileSize: '',
    file: null,
    documentType: 'Notes', 
  });

  const [errorMsg, setErrorMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      const file = files[0];
      setFormData({
        ...formData,
        file,
        fileSize: file ? (file.size / (1024 * 1024)).toFixed(2) : '',
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  
  const validateForm = () => {
    const { subject, forClass, unit, semester, fileSize, file } = formData;
    if (!subject || !forClass || !unit || !semester || !file) {
      setErrorMsg('Please fill in all the fields.');
      return false;
    }
    if ( file.size > MAX_FILE_SIZE) {
      
      setErrorMsg('File size should be less than 10MB.');
      return false;
    }
    const validFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validFileTypes.includes(file.type)) {
      setErrorMsg('Please upload a valid file. Only PDF and DOC/DOCX files are allowed.');
      return false;
    }
    setErrorMsg(null); 
    return true;
  };

 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formDataToSubmit.append(key, value);
      }
    });

    dispatch(uploadNote(formDataToSubmit));
  };

  useEffect(() => {
    if (success) {
      toast.success('Note Uploaded successfully!');  

      setFormData({
        subject: '',
        forClass: '',
        unit: '',
        semester: '',
        fileSize: '',
        file: null,
        documentType: 'Notes',
      });

      setTimeout(() => {
        navigate('/AddNotes');
        dispatch(resetUploadState());
        dispatch(fetchNotes());
      }, 2000); 
    } else if (error) {
      toast.error('Failed to Upload note. Please try again.'); 
    }
  }, [success, error, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-slate-100">
      <div className="p-8 sm:p-10 rounded-xl shadow-lg w-full max-w-2xl bg-white">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">Upload Your Notes</h2>

        {errorMsg && <p className="text-red-500 mb-4 text-center">{errorMsg}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subject Name */}
          <div>
            <label className="block text-lg text-gray-700 font-medium mb-2">Subject Name</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter subject name e.g., OOP"
              required
            />
          </div>

          {/* For Class */}
          <div>
            <label className="block text-lg text-gray-700 font-medium mb-2">For Class</label>
            <input
              type="text"
              name="forClass"
              value={formData.forClass}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter class e.g., AI & DS"
              required
            />
          </div>

          {/* Unit, Semester */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Unit */}
            <div>
              <label className="block text-lg text-gray-700 font-medium mb-2">Unit</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>Select unit</option>
                {[1, 2, 3, 4].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="block text-lg text-gray-700 font-medium mb-2">Semester</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>Select semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            {/* File Size - Hidden on Mobile */}
            <div className="hidden sm:block">
              <label className="block text-lg text-gray-700 font-medium mb-2">File Size (MB)</label>
              <input
                type="text"
                name="fileSize"
                value={formData.fileSize}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
                placeholder="File Size"
              />
            </div>
          </div>

          {/* Document Type */}
          <div className="mt-6">
            <label className="block text-lg text-gray-700 font-medium mb-2">Document Type</label>
            <div className="sm:hidden">
              <select
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {['Notes', 'Semester PYQ', 'MidTerm PYQ', 'Practical File'].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="hidden sm:flex flex-wrap space-x-5">
              {['Notes', 'Semester PYQ', 'MidTerm PYQ', 'Practical File'].map((type) => (
                <label key={type} className="flex items-center cursor-pointer space-x-2">
                  <input
                    type="radio"
                    name="documentType"
                    value={type}
                    checked={formData.documentType === type}
                    onChange={handleChange}
                    className="form-radio text-blue-600 h-5 w-5"
                  />
                  <span className="text-gray-700 capitalize">{type.replace(/^./, (str) => str.toUpperCase())}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Upload Document */}
          <div className="mt-8">
            <label className="block text-lg text-gray-700 font-medium mb-2">Upload Document</label>
            <div className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <input
                type="file"
                name="file"
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                className="w-full text-gray-700"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full mt-6 p-3 text-lg font-semibold text-white bg-blue-500 rounded-lg focus:outline-none hover:bg-blue-600 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? <ClipLoader size={24} color="#ffffff" /> : 'Upload Note'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadNotes;