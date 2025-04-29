import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Adjust path if needed
import { useNavigate, Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // Optional: for password visibility

function AuthForm({ isLogin }) {
  const [formData, setFormData] = useState({
    username: '', // Only for registration
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Optional
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const { username, email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic client-side validation (optional but good practice)
    if (!email || !password || (!isLogin && !username)) {
        setError('Please fill in all required fields.');
        setLoading(false);
        return;
    }
     if (!isLogin && password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setLoading(false);
        return;
    }

    try {
      let userData;
      if (isLogin) {
        userData = await login({ email, password });
      } else {
        userData = await register({ username, email, password });
      }
       if (userData) {
         navigate('/dashboard'); // Redirect on success
       } else {
         // This case might occur if login/register resolves without error but returns no user
         setError('Authentication failed. Please try again.');
       }
    } catch (err) {
      // Use error message from backend response if available
      setError(err.response?.data?.msg || err.message || 'An error occurred during authentication.');
      console.error("Authentication error:", err.response || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Form container with frosted glass effect
    <div className="w-full max-w-md bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
        {isLogin ? 'Welcome Back!' : 'Create Account'}
      </h2>
      <form onSubmit={onSubmit} className="space-y-6">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={onChange}
              required={!isLogin}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
              placeholder="Choose a username"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
            placeholder="you@example.com"
          />
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="password">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            minLength={isLogin ? undefined : 6}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 pr-10" // Added pr-10 for icon
            placeholder="Enter your password"
          />
           {/* Optional: Password visibility toggle */}
           <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-sm leading-5" // Adjusted top-7
              aria-label={showPassword ? "Hide password" : "Show password"}
           >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              )}
          </button>
        </div>

        {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
            </span>
          ) : (isLogin ? 'Log In' : 'Register')}
        </button>
      </form>
      <p className="text-center text-gray-600 dark:text-gray-400 mt-8 text-sm">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <Link to={isLogin ? '/register' : '/login'} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition duration-150 ease-in-out">
          {isLogin ? 'Sign up here' : 'Log in here'}
        </Link>
      </p>
    </div>
  );
}

export default AuthForm;