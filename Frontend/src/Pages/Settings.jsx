import React from 'react';

const MaintenancePage = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center  bg-white"
      style={{
        margin: '8px',
        padding: '150px',
        fontFamily: 'Helvetica, sans-serif',
      }}
    >
      <article
        className="w-full max-w-2xl mx-auto bg-white p-10 rounded-lg  text-left h-full"
        style={{
          width: '700px',
          color: '#333333',
        }}
      >
        <h1
          className="text-4xl font-bold mb-6"
          style={{
            fontSize: '50px',
            lineHeight: 'normal',
            letterSpacing: 'normal',
            textAlign: 'left',
          }}
        >
          We’ll be back soon!
        </h1>
        <p
          className="text-lg mb-4"
          style={{
            fontSize: '20px',
            lineHeight: 'normal',
            letterSpacing: 'normal',
            textAlign: 'left',
          }}
        >
          Sorry for the inconvenience but we’re performing some maintenance at
          the moment. If you need to, you can always{' '}
          <a
            href="mailto:support@example.com"
            className="text-orange-600 hover:underline"
          >
            contact us
          </a>
          , otherwise, we’ll be back online shortly!
        </p>
        <p
          className="mt-8 text-lg italic text-gray-600"
          style={{
            fontSize: '18px',
            textAlign: 'right',
          }}
        >
          — The Team
        </p>
      </article>
    </div>
  );
};

export default MaintenancePage;
