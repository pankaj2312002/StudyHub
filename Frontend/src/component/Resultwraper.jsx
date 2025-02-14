import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Studymaterialcard from './Studymaterialcard';
import { fetchNotes } from '../redux/Slices/Notesslice';

const NavigationMenu = () => {
  // Keeps track of the currently selected filter (default: "All")
  const [activeItem, setActiveItem] = useState('All');
  // Controls how many notes are displayed initially (default: 5).
  const [visibleNotes, setVisibleNotes] = useState(5);
  //  Boolean to handle loading state for lazy loading.
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  //  Boolean to toggle dropdown menu of categories (for mobile view).
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const { notes, loading, error } = useSelector((state) => state.notes);

  useEffect(() => {
   
    dispatch(fetchNotes());
  }, [dispatch]);

  const filterOptions = ['All', 'Notes', 'Semester PYQ', 'MidTerm PYQ', 'Practical Files'];

  // notes me saara data ek sath aa gaya hai , ab isko tyahi per category base per filter kar 
  // no frequent api calls needed
  const filteredMaterials = notes?.filter((material) => {
    switch (activeItem) {
      case 'All': return true;
      case 'Notes': return material.documentType === 'Notes';
      case 'Semester PYQ': return material.documentType === 'Semester PYQ';
      case 'MidTerm PYQ': return material.documentType === 'MidTerm PYQ';
      case 'Practical Files': return material.documentType === 'Practical File';
      default:
        return false;
    }
  });

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleNotes((prevVisibleNotes) => prevVisibleNotes + 5);
      setIsLoadingMore(false);
    }, 500);
  };

  return (
    <div className='h-screen bg-white mt-8 mx-5 rounded-xl relative'>
      {/* Filter Menu */}
      <div className='text-slate-600 p-4 font-semibold'>
        {/* Mobile view:*/}
        <div className='block sm:hidden'>
          {/* category select karne ka button */}
          <button
            className='w-full text-left bg-gray-200 p-3 rounded flex justify-between items-center'
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {activeItem}
            <span className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}>
              ▼
            </span>
          </button>
          {/* categories ki list  */}
          {isDropdownOpen && (
            <ul className='mt-2 bg-gray-100 rounded shadow-lg border border-gray-200'>
              {filterOptions.map((item) => (
                <li
                  key={item}
                  className={`p-2 cursor-pointer ${
                    activeItem === item ? 'bg-gray-300 font-bold' : 'hover:bg-gray-200'
                  }`}
                  onClick={() => {
                    setActiveItem(item);
                    setVisibleNotes(5);
                    setIsDropdownOpen(false);
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Desktop view*/}
        <ul className='hidden sm:flex row justify-evenly'>
          {filterOptions.map((item) => (
            <li
              key={item}
              className={`cursor-pointer ${
                activeItem === item
                  ? 'text-black border-b-2 border-black underline-offset-4'
                  : 'hover:text-black hover:underline hover:underline-offset-4'
              }`}
              onClick={() => {
                setActiveItem(item);
                setVisibleNotes(5);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className='mx-5 p-5 rounded-xl'>
        {loading && (
          <div className='flex justify-center items-center h-full'>
            <h1>Loading...</h1>
          </div>
        )}
        {error && (
          <div className='flex justify-center items-center h-full'>
            <h1>Sorry Notes Not Found!!!</h1>
          </div>
        )}
        {!loading && !error && filteredMaterials.length === 0 && (
          <div className='flex justify-center items-center h-full'>
            <h1>No materials found</h1>
          </div>
        )}
        {/* studymaterialcard compnent rendering */}
        {!loading && !error && filteredMaterials.length > 0 && (
          <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
            {filteredMaterials
              .slice(0, visibleNotes)
              .map((note) => <Studymaterialcard note={note} key={note?._id} />)}
          </div>
        )}
      </div>

      {!loading && !error && filteredMaterials.length > visibleNotes && (
        <div className='text-center p-4'>
          <button
            onClick={handleLoadMore}
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:scale-105 transition-transform duration-300 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95
              ${isLoadingMore ? 'animate-pulse' : ''}
            `}
          >
            {isLoadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default NavigationMenu;