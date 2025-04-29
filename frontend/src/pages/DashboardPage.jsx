import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getProjects, createProject, updateProject, deleteProject } from '../services/api';
import ProjectForm from '../componenets/ProjectForm';
import ProjectTable from '../componenets/ProjectTable';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaBell, FaUserCircle } from 'react-icons/fa';

function DashboardPage() {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activePage, setActivePage] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;

  // --- Weather API State ---
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);

  // --- Weather API: Define Location (Example: Chicago, Illinois) ---
  // You can change these coordinates or make them dynamic based on user settings or project location
  const weatherLatitude = 41.8781;
  const weatherLongitude = -87.6298;

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getProjects();
      setProjects(response.data || []);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- Fetch Weather Data Effect ---
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setWeatherLoading(true);
        setWeatherError(null); // Clear previous errors

        // Open-Meteo API URL
        // Fetching current weather including temperature, weather code, and wind speed
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${weatherLatitude}&longitude=${weatherLongitude}&current_weather=true&temperature_unit=fahrenheit&weathercode&windspeed_unit=mph&timezone=auto`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setWeatherData(data.current_weather); // Set the current_weather object
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
        setWeatherError(error);
      } finally {
        setWeatherLoading(false);
      }
    };

    // Fetch weather data when the component mounts or location changes
    fetchWeatherData();
  }, [weatherLatitude, weatherLongitude]); // Dependencies for useEffect


  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user, fetchProjects]);

  const handleAddProject = () => {
    setEditingProject(null);
    setActivePage('create');
  };

  const handleEditProjectClick = (project) => {
    setEditingProject(project);
    setActivePage('create');
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        await fetchProjects();
      } catch (err) {
        console.error('Failed to delete project:', err);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    try {
      if (editingProject) {
        await updateProject(editingProject._id, formData);
      } else {
        await createProject(formData);
      }
      await fetchProjects();
      setActivePage('view');
      setEditingProject(null);
    } catch (err) {
      console.error('Failed to save project:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (!user) return <div className="p-8 text-center">Loading user data...</div>;

    // Helper function to interpret Open-Meteo weather codes (simplified)
  const getWeatherDescription = (code) => {
    // This is a very basic mapping. Refer to Open-Meteo docs for full codes.
    if (code === 0) return 'Clear sky';
    if (code > 0 && code < 4) return 'Mainly clear to partly cloudy';
    if (code >= 45 && code < 49) return 'Fog';
    if (code >= 51 && code < 57) return 'Drizzle';
    if (code >= 61 && code < 67) return 'Rain';
    if (code >= 71 && code < 77) return 'Snow fall';
    if (code >= 80 && code < 82) return 'Rain showers';
    if (code >= 85 && code < 87) return 'Snow showers';
    if (code === 95) return 'Thunderstorm';
    if (code > 95) return 'Thunderstorm with hail';
    return 'N/A';
  };


  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white fixed h-full p-6">
        <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
        <nav className="space-y-4">
          <button onClick={() => setActivePage('overview')} className="w-full text-left">Overview</button>
          <button onClick={handleAddProject} className="w-full text-left">Create Project</button>
          <button onClick={() => setActivePage('view')} className="w-full text-left">View Projects</button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="ml-64 w-full">
        {/* Navbar */}
        <div className="fixed top-0 left-64 right-0 bg-white p-4 shadow-md flex justify-between items-center z-10">
          <h1 className="text-xl font-bold text-gray-800">Project Manager</h1>
          <div className="flex items-center space-x-4">
            <FaBell size={20} />
            <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="flex items-center space-x-2">
              <FaUserCircle size={24} />
              <span>{user.username}</span>
            </button>
            {profileMenuOpen && (
              <div className="absolute right-6 mt-12 w-48 bg-white shadow-lg rounded-md">
                <ul>
                  <li className="px-4 py-2 cursor-pointer" onClick={logout}>Logout</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div className="pt-24 px-6 pb-12">

          {/* Overview */}
          {activePage === 'overview' && (
            <>
              {/* Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Projects', value: projects.length, color: 'bg-blue-500' },
                  { label: 'Completed', value: projects.filter(p => p.status === 'Completed').length, color: 'bg-green-500' },
                  { label: 'In Progress', value: projects.filter(p => p.status === 'In Progress').length, color: 'bg-yellow-500' },
                  { label: 'Today', value: selectedDate.toDateString(), color: 'bg-purple-500' },
                ].map((card, index) => (
                  <div key={index} className={`p-4 rounded text-white shadow ${card.color}`}>
                    <div className="text-sm">{card.label}</div>
                    <div className="text-2xl font-bold">{card.value}</div>
                  </div>
                ))}
              </div>

              {/* Recent Projects */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Projects</h2>

                <input
                  type="text"
                  placeholder="Search Projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border p-2 rounded w-full mb-4"
                />

                <div className="overflow-x-auto bg-white shadow rounded-lg">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase">Title</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase hidden md:table-cell">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase hidden md:table-cell">Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedProjects.map((project) => (
                        <tr key={project._id} className="hover:bg-gray-100">
                          <td className="px-4 py-2 font-medium text-gray-900">{project.title}</td>
                          <td className="px-4 py-2 hidden md:table-cell">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              project.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 hidden md:table-cell text-gray-600">
                            {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center space-x-4 mt-4">
                  <button
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span className="text-sm font-medium">{currentPage} of {totalPages}</span>
                  <button
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* Notifications + Calendar + Weather */}
              {/* Adjusted grid to accommodate weather widget */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Added lg:grid-cols-3 */}
                {/* Notifications */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Notifications</h3>
                  <ul className="space-y-2">
                    <li className="text-gray-700">✅ New task assigned.</li>
                    <li className="text-gray-700">✅ Project updated successfully.</li>
                    <li className="text-gray-700">✅ Weekly meeting scheduled for Friday.</li>
                  </ul>
                </div>

                {/* Calendar */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Calendar</h3>
                  <Calendar value={selectedDate} onChange={setSelectedDate} />
                </div>

                {/* Weather Widget */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Current Weather</h3>
                  {weatherLoading && <p>Loading weather...</p>}
                  {weatherError && <p className="text-red-500">Error fetching weather: {weatherError.message}</p>}
                  {weatherData && (
                    <div>
                      <p>Temperature: {weatherData.temperature}°F</p>
                      <p>Wind Speed: {weatherData.windspeed} mph</p>
                       {/* Use the helper function to display weather description */}
                      <p>Conditions: {getWeatherDescription(weatherData.weathercode)}</p>
                      {/* Add more weather details as needed */}
                    </div>
                  )}
                </div>
              </div>

              {/* ... rest of overview */}
            </>
          )}

          {/* Create */}
          {activePage === 'create' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{editingProject ? 'Edit Project' : 'Create Project'}</h2>
              <ProjectForm
                project={editingProject}
                onSubmit={handleFormSubmit}
                onCancel={() => setActivePage('view')}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* View */}
          {activePage === 'view' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">All Projects</h2>
              <ProjectTable
                projects={projects}
                onEdit={handleEditProjectClick}
                onDelete={handleDeleteProject}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;