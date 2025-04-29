// src/components/ProjectTable.jsx
import React from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'; // Using outline icons

function ProjectTable({ projects, onEdit, onDelete }) {

  const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      try {
          const date = new Date(dateString);
          // Adjust timezone if needed, here using locale default
          return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      } catch (e) {
          return 'Invalid Date';
      }
  };

  const getStatusColor = (status) => {
      switch (status) {
          case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
          case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
          case 'On Hold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
          case 'Not Started': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
          default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      }
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Title
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
              Description
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
              Due Date
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {projects.map((project) => (
            <tr key={project._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{project.title}</div>
              </td>
              <td className="px-6 py-4 max-w-sm hidden md:table-cell">
                 {/* Truncate long descriptions */}
                <div className="text-sm text-gray-700 dark:text-gray-300 truncate">{project.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </td>
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                {formatDate(project.dueDate)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button
                  onClick={() => onEdit(project)}
                  className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                  title="Edit Project"
                >
                  <PencilSquareIcon className="h-5 w-5 inline" />
                   <span className="sr-only">Edit</span> {/* Screen reader text */}
                </button>
                <button
                  onClick={() => onDelete(project._id)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                   title="Delete Project"
                >
                  <TrashIcon className="h-5 w-5 inline" />
                  <span className="sr-only">Delete</span> {/* Screen reader text */}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProjectTable;