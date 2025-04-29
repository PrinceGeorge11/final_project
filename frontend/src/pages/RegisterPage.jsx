import React from 'react';
import AuthForm from '../componenets/AuthForm'; // Adjust path if needed

// --- IMPORTANT ---
// Use the same background image path as in LoginPage.jsx
const backgroundImageUrl = '/background.jpg';
// import backgroundImage from '../assets/background.jpg';
// const backgroundImageUrl = backgroundImage;

function RegisterPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-12 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content wrapper */}
      <div className="relative z-10">
        <AuthForm isLogin={false} />
      </div>
    </div>
  );
}

export default RegisterPage;