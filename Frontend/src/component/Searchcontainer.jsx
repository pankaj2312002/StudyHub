import React, { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { fetchNotes, fetchNotesBysearchQuery } from '../redux/Slices/Notesslice';

// Delays execution of func (API call) until the user stops typing
// Prevents unnecessary API calls on every keystroke
// func: The actual function that we want to delay execution for.
function debounce(func, wait) {
  let timeout;
  // The function returns a new function that wraps func inside a controlled execution.
  return function executedFunction(...args) {

    clearTimeout(timeout);

    timeout = setTimeout(  () => {
         clearTimeout(timeout);
         func(...args);
    }, wait);

  }
}


function Searchcontainer() {
  // Change input field styling dynamically when it’s active or inactive.
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setsearchQuery] = useState('');
  const dispatch = useDispatch();
  
// using useCallback hook here
// handleSearch function re-render hone par naye reference na banaye.
// calling debounce function
// dependencies : the function will be re-created only if one of the dependencies changes.
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
  // dispatch ko dependency array me nahi rakhta toh bhi koi khass fark nahi padta
  // Including dispatch ensures that if, for any reason, dispatch is replaced (e.g., due to different Redux store instances in some advanced cases), the function updates accordingly

  const handleChange = (e) => {
    const newQuery = e.target.value;
    setsearchQuery(newQuery);
    // handleSearch ko call karne ka matlab hai debounce ko call karna 
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
              placeholder="Search by subject or publisher..."
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


//  Code Flow Summary:
// 1.User kuch type karega → handleChange trigger hoga.
// 2.handleChange → setsearchQuery update karega aur handleSearch call karega.
// 3.handleSearch debounce ke saath kaam karega:
//    Agar user typing continue kare to API request cancel hoti rahegi.
//    Agar user ruk jaye (300ms tak) tab API request jaayegi.
// 4.Redux action trigger hoga → fetchNotesBysearchQuery(query) call hoga agar query hai.
// 5.Agar input empty ho jaye to fetchNotes() call hoga jo saare notes fetch karega.
// 6.Search icon aur styling bhi input ke focus hone par change hoti hai.