// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Imports the main App component (with routing)
import { AuthProvider } from './contexts/AuthContext.jsx'; // Import your AuthProvider
import './index.css'; // Imports global CSS, including Tailwind directives

// Get the root element from your index.html
const rootElement = document.getElementById('root');

// Ensure the root element exists before trying to render
if (!rootElement) {
  throw new Error("Failed to find the root element. Make sure your index.html has <div id='root'></div>.");
}

// Create the React root
const root = ReactDOM.createRoot(rootElement);

// Render the application
root.render(
  <React.StrictMode>
    {/* AuthProvider wraps the entire App, making auth state available everywhere */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);