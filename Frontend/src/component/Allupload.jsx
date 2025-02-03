

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { deleteNotes } from '../redux/Slices/UploadNotesSlice';
import { fetchNotes } from '../redux/Slices/Notesslice';
import { toast } from 'react-hot-toast'; 

const UserNotesTable = () => {
  const dispatch = useDispatch();

  const { notes, loading } = useSelector((state) => state.notes);
  const { user } = useSelector((state) => state.auth);

  const [userNotes, setUserNotes] = useState([]);
  const [visibleNotes, setVisibleNotes] = useState(5);

  useEffect(() => {
    if (user && notes?.length > 0) {
      const filteredNotes = notes.filter((note) => note.uploadedBy._id === user._id);
      setUserNotes(filteredNotes);
    }
  }, [notes, user]);

  
  const handleLoadMore = () => {
    setVisibleNotes((prevVisible) => prevVisible + 5); 
  };

  
  const handleDelete = (noteId) => {
   
    dispatch(deleteNotes(noteId)).then((result) => {
      if (deleteNotes.fulfilled.match(result)) {
        dispatch(fetchNotes());
        setUserNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
        toast.success('Note deleted successfully!');
      } else {
        toast.error('Failed to delete note. Please try again.');
      }
    });
  };

  return (
    <div className="flex items-center justify-center p-4 sm:p-8">
      <div className="p-6 sm:p-10 rounded-xl shadow-lg w-full max-w-6xl bg-slate-50 h-full">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-800">
          Your Uploaded Notes
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : userNotes.length > 0 ? (
          <>
            <div className="hidden sm:grid sm:grid-cols-6 bg-gray-200 font-bold p-4 rounded-t-lg">
              <div className="col-span-2">Subject Name</div>
              <div>Unit</div>
              <div>Semester</div>
              <div>Document Type</div>
              <div className="text-center">Actions</div>
            </div>
            <div>
              {userNotes.slice(0, visibleNotes).map((note) => (
                <div
                  key={note._id}
                  className="grid grid-cols-1 sm:grid-cols-6 gap-4 p-4 border-b border-gray-200 hover:bg-gray-100 text-sm sm:text-base mb-2"
                >
                  <div className="sm:col-span-2">
                    <span className="font-bold sm:hidden">Subject Name: </span>
                    {note.subject}
                  </div>
                  <div>
                    <span className="font-bold sm:hidden">Unit: </span>
                    {note.unit}
                  </div>
                  <div>
                    <span className="font-bold sm:hidden">Semester: </span>
                    {note.semester}
                  </div>
                  <div className="capitalize">
                    <span className="font-bold sm:hidden">Document Type: </span>
                    {note.documentType}
                  </div>
                  <div className="flex lg:justify-center ">
                    <span className="font-bold sm:hidden">Actions: </span>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete Note"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
           
            {visibleNotes < userNotes.length && (
              <div className="flex lg:  mt-6">
                <button
                  onClick={handleLoadMore}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-600">You haven't uploaded any notes yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserNotesTable;