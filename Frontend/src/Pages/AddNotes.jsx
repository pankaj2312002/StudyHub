import React, { useState } from 'react';
import Allupload from '../component/Allupload';
import Newupload from '../component/Newupload';

function AddNotes() {
  const [activeComponent, setActiveComponent] = useState('all');

  return (
    <div 
      className="mx-auto p-4 shadow-lg bg-slate-100" 
      style={{
        height: '100%', 
        minHeight: '100vh', 
        overflowY: 'auto'   
      }}
    >
      <nav className="flex justify-around mb-4 ">
        <button
          onClick={() => setActiveComponent('all')}
          className={`px-4 py-2 rounded-lg ${
            activeComponent === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          All Upload
        </button>
        <button
          onClick={() => setActiveComponent('new')}
          className={`px-4 py-2 rounded-lg ${
            activeComponent === 'new' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          New Upload
        </button>
      </nav>

      <div className="relative h-full"> 
        {activeComponent === 'all' && <Allupload />}
        {activeComponent === 'new' && <Newupload />}
      </div>
    </div>
  );
}

export default AddNotes;