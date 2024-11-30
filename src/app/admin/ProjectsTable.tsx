'use client';

import { useEffect, useState } from 'react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  user_id: string;
  start_date: string;
}

interface User {
  id: string;
  name: string;
}

export default function ProjectsTable() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editedProject, setEditedProject] = useState<Project>({
    id: '',
    name: '',
    description: '',
    status: '',
    user_id: '',
    start_date: '',
  });

  // Fetch projects and users data on component mount
  useEffect(() => {
    const fetchProjectsAndUsers = async () => {
      try {
        const [projectsResponse, usersResponse] = await Promise.all([
          fetch('/api/admin/projects'),
          fetch('/api/admin/users'),
        ]);

        const [projectsData, usersData] = await Promise.all([
          projectsResponse.json(),
          usersResponse.json(),
        ]);

        setProjects(projectsData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsAndUsers();
  }, []);

  // Helper function to get the user name by user_id
  const getUserNameById = (userId: string) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : 'Unknown User';
  };

  // Handle the edit button click
  const handleEditClick = (project: Project) => {
    setEditingProjectId(project.id);
    setEditedProject(project);
  };

  // Handle canceling the edit
  const handleCancelEdit = () => {
    setEditingProjectId(null);
    setEditedProject({
      id: '',
      name: '',
      description: '',
      status: '',
      user_id: '',
      start_date: '',
    });
  };

  // Update project
  const updateProject = async (updatedProject: Project) => {
    try {
      await fetch('/api/admin/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProject),
      });
      setProjects(
        projects.map((project) =>
          project.id === updatedProject.id ? updatedProject : project
        )
      );
      setEditingProjectId(null);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  // Delete project
  const deleteProject = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this project?');
    if (!confirmed) return;

    try {
      await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' });
      setProjects(projects.filter((project) => project.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Render loading state while fetching data
  if (loading) {
    return <p className="text-center">Loading projects...</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Projects</h2>
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full bg-white border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
              <th className="py-3 px-6 text-left font-medium">User Name</th>
              <th className="py-3 px-6 text-left font-medium">Name</th>
              <th className="py-3 px-6 text-left font-medium">Description</th>
              <th className="py-3 px-6 text-left font-medium">Status</th>
              <th className="py-3 px-6 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {projects.map((project) => (
              <tr key={project.id} className="border-t hover:bg-gray-50 transition">
                {editingProjectId === project.id ? (
                  <>
                    <td className="py-3 px-6">{getUserNameById(project.user_id)}</td>
                    <td className="py-3 px-6">
                      <input
                        type="text"
                        value={editedProject.name || ''}
                        onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
                        className="border w-full p-2 rounded"
                      />
                    </td>
                    <td className="py-3 px-6">
                      <input
                        type="text"
                        value={editedProject.description || ''}
                        onChange={(e) =>
                          setEditedProject({ ...editedProject, description: e.target.value })
                        }
                        className="border w-full p-2 rounded"
                      />
                    </td>
                    <td className="py-3 px-6">
                      <input
                        type="text"
                        value={editedProject.status || ''}
                        onChange={(e) =>
                          setEditedProject({ ...editedProject, status: e.target.value })
                        }
                        className="border w-full p-2 rounded"
                      />
                    </td>
                    <td className="py-3 px-6">
                      <button
                        onClick={() => updateProject({ ...project, ...editedProject })}
                        className="text-green-600 font-medium hover:underline"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="ml-4 text-red-600 font-medium hover:underline"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-3 px-6">{getUserNameById(project.user_id)}</td>
                    <td className="py-3 px-6">{project.name}</td>
                    <td className="py-3 px-6">{project.description}</td>
                    <td className="py-3 px-6">{project.status}</td>
                    <td className="py-3 px-6">
                      <button
                        onClick={() => handleEditClick(project)}
                        className="text-orange-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="ml-4 text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}