import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser, faStickyNote, faUpload, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/Slices/Authslice'; 
import { toast } from 'react-hot-toast'; 

function Navbar() {
  // hamburger menu show , open or close 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  
  
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
console.log("user =>", user)
  
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // close the dropdown menu when the user clicks outside of it.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const logoutHandler = () => {
   
    dispatch(logout());
    toast.success('LogOut Successfully!'); 
  };

  return (
    <nav className="bg-white px-4 sm:px-6 py-4 flex justify-between items-center border border-gray-300">
      <div className="flex items-center">
        <span className="text-black ml-3 text-2xl font-bold">StudyHub</span>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        {isAuthenticated ? (
          <>
            <NavLink to="/AddNotes">
              <button className="bg-black text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full transition duration-300 transform hover:scale-105 text-xs sm:text-base">
                Add Notes
              </button>
            </NavLink>

           
            <div className="relative dropdown">
              <button onClick={handleMenuToggle} className="focus:outline-none cursor-pointer">
                <FontAwesomeIcon icon={faBars} className="text-black text-2xl" />
              </button>

             
              <div
                className={`z-20 absolute right-0 mt-2 w-56 bg-white border border-gray-300 shadow-lg rounded-md transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{ visibility: isMenuOpen ? 'visible' : 'hidden' }}
              >
              
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faUser} className="text-black text-xl" />
                    <div>
                      <p className="text-sm font-medium text-black">{user?.username}</p>
                      <p className="text-xs text-gray-500">{user?.branch}, Year {user?.year}</p>
                    </div>
                  </div>
                </div>

                
                <NavLink
                  to="/AddNotes"
                  className="px-4 py-2 text-black hover:bg-gray-100 flex items-center space-x-2 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faStickyNote} />
                  <span className="text-sm">All Notes</span>
                </NavLink>

                <NavLink
                  to="/AddNotes"
                  className="px-4 py-2 text-black hover:bg-gray-100 flex items-center space-x-2 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faUpload} />
                  <span className="text-sm">New Upload</span>
                </NavLink>

                <NavLink
                  to="/Settings"
                  className="px-4 py-2 text-black hover:bg-gray-100 flex items-center space-x-2 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faCog} />
                  <span className="text-sm">Settings</span>
                </NavLink>

                
                <hr className="my-2 border-gray-300" />

                <div
                  onClick={logoutHandler}
                  className="px-4 py-2 text-black hover:bg-gray-100 flex items-center space-x-2 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span className="text-sm">Logout</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <NavLink to="/Login">
              <button className="bg-black text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full transition duration-300 transform hover:scale-105 text-xs sm:text-base">
                Login
              </button>
            </NavLink>

            <NavLink to="/SignUp">
              <button className="bg-black text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full transition duration-300 transform hover:scale-105 text-xs sm:text-base">
                Sign Up
              </button>
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;