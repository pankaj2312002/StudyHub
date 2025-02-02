import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as solidThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as regularThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { toggleLikeNote } from '../redux/Slices/Likeslice'; 
import { toast } from 'react-hot-toast'; 

const Studymaterialcard = ({ note }) => {
  const {
    documentType,
    subject,
    forClass,
    unit,
    semester,
    fileType,
    fileSize,
    uploadedBy,
    updatedAt,
    likes,
    _id,
    file
  } = note;

  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const UserID = useSelector((state) => state.auth.user?._id);

  const [isLiked, setIsLiked] = useState(likes.includes(UserID));
  const [count, setCount] = useState(likes.length || 0);

  const formatDate = (dateString) => {
    if (!dateString) return 'unknown';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'unknown';
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    }).format(date).replace(/\//g, '-');
  };

  const toggleLike = (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please log in or sign up to like notes.");
      return;
    }
    setIsLiked((prevIsLiked) => {
      const newCount = prevIsLiked ? count - 1 : count + 1;
      setCount(newCount);
      dispatch(toggleLikeNote({ noteId: _id, userLiked: isLiked }))
        .then((result) => {
          if (result.type.endsWith('/fulfilled')) {
            toast.success(prevIsLiked ? 'Like removed.' : 'Note liked!');
          } else {
            toast.error('Failed to toggle like. Please try again.');
          }
        });
      return !prevIsLiked;
    });
  };

  const handleDownload = (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please log in or sign up to download notes.");
      return;
    }
    const link = document.createElement('a');
    link.href = file;
    link.setAttribute('download', file.split('/').pop());
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download started!');
  };

  const handlePreview = (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please log in or sign up to preview notes.");
      return;
    }
    window.open(file, '_blank');
    toast.success('Opening preview...');
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-md border-2 sm:max-w-sm md:max-w-md lg:max-w-lg">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <span className="text-gray-700 font-bold text-xl capitalize">{documentType || 'Notes'}</span>
        <div onClick={toggleLike} className="cursor-pointer text-md font-medium flex flex-col gap-1">
          {isLiked ? (
            <FontAwesomeIcon icon={solidThumbsUp} className="text-blue-500 text-xl" />
          ) : (
            <FontAwesomeIcon icon={regularThumbsUp} className="text-gray-500 text-xl" />
          )}
          <h3>{count}</h3>
        </div>
      </div>

    <div className="text-gray-600 space-y-1">
  <div className="space-y-1">
    <div className="flex justify-center items-center space-x-4 min-w-[240px]">
      <p className="font-medium"><strong>Subject:</strong></p>
      <p className="flex-1 text-end">{subject || 'unknown'}</p>
    </div>
    <div className="flex justify-center items-center space-x-4 min-w-[240px]">
      <p className="font-medium"><strong>For:</strong></p>
      <p className="flex-1 text-end">{forClass || 'unknown'}</p>
    </div>
    <div className="flex justify-center items-center space-x-4 min-w-[240px]">
      <p className="font-medium"><strong>Unit:</strong></p>
      <p className="flex-1 text-end">{unit || 'unknown'}</p>
    </div>
    <div className="flex justify-center items-center space-x-4 min-w-[240px]">
      <p className="font-medium"><strong>Semester:</strong></p>
      <p className="flex-1 text-end">{semester || 'unknown'}</p>
    </div>
    <div className="flex justify-center items-center space-x-4 min-w-[240px]">
      <p className="font-medium"><strong>File Type:</strong></p>
      <p className="flex-1 text-end">{fileType || 'unknown'}</p>
    </div>
    <div className="flex justify-center items-center space-x-4 min-w-[240px]">
      <p className="font-medium"><strong>File Size:</strong></p>
      <p className="flex-1 text-end">{fileSize || 'unknown'}</p>
    </div>
    <div className="flex justify-center items-center space-x-4 min-w-[240px]">
      <p className="font-medium"><strong>Uploaded By:</strong></p>
      <p className="flex-1 text-end">{uploadedBy?.username || 'unknown'}</p>
    </div>
    <div className="flex justify-center items-center space-x-4 min-w-[240px]">
      <p className="font-medium"><strong>Uploaded On:</strong></p>
      <p className="flex-1 text-end">{formatDate(updatedAt)}</p>
    </div>
  </div>
</div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-6">
        <button onClick={handlePreview} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
          Preview
        </button>
        <button onClick={handleDownload} className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-300 transform hover:scale-105">
          Download
        </button>
      </div>
    </div>
  );
};

export default Studymaterialcard;
