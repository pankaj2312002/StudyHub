import React, { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { fetchNotes, fetchNotesBysearchQuery } from '../redux/Slices/Notesslice';


function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function Searchcontainer() {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setsearchQuery] = useState('');
  const dispatch = useDispatch();

  const handleSearch = useCallback(
    debounce((query) => {
      if (query.trim()) {
        dispatch(fetchNotesBysearchQuery(query));
      } else {
        dispatch(fetchNotes());
      }
    }, 300), 
    [dispatch]
  );

  const handleChange = (e) => {
    const newQuery = e.target.value;
    setsearchQuery(newQuery);
    handleSearch(newQuery);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
  };

  return (
    <div className="text-center mt-5 px-4">
      <h1 className="font-lato md:text-4xl sm:text-3xl lg:text-5xl font-semibold">
        Welcome <span className="text-blue-700">Student</span>
      </h1>

      <div className="relative mt-4 w-full sm:w-4/5 lg:w-3/5 mx-auto">
        <div className="flex items-center pl-3">
          <FontAwesomeIcon
            icon={faSearch}
            className={`absolute left-6 top-1/2 transform -translate-y-1/2 text-lg sm:text-xl ${isFocused ? 'text-black' : 'text-gray-500'}`}
          />

          <form className="w-full" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Search..."
              className="p-5 pl-10 w-full h-12 sm:h-14 border border-gray-300 rounded-xl text-base sm:text-xl focus:outline-none"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              value={searchQuery}
              onChange={handleChange}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Searchcontainer;