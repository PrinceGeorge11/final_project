import React from 'react';
import AuthForm from '../componenets/AuthForm'; // Adjust path if needed

// --- IMPORTANT ---
// Replace this with the actual path to your background image
// Option 1: Image in the 'public' folder
const backgroundImageUrl = '/background2.jpg';
// Option 2: Image imported from 'src/assets'
// import backgroundImage from '../assets/background.jpg';
// const backgroundImageUrl = backgroundImage; // Use the imported variable

function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-12 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content wrapper to ensure form is above overlay */}
      <div className="relative z-10">
        <AuthForm isLogin={true} />
      </div>
    </div>
  );
}

export default LoginPage;