import React from 'react';
import { InnovationProject } from '../types';

interface ProjectSwitcherProps {
    projects: InnovationProject[];
    currentProjectId: string | null;
    onSelectProject: (id: string) => void;
    onNewProject: () => void;
    onDeleteProject: (id: string) => void;
}

const ProjectSwitcher: React.FC<ProjectSwitcherProps> = ({ projects, currentProjectId, onSelectProject, onNewProject, onDeleteProject }) => {

    const handleDelete = () => {
        if(currentProjectId) {
            onDeleteProject(currentProjectId);
        }
    }

    return (
        <div className="flex items-center space-x-2">
             <select
                value={currentProjectId || ''}
                onChange={(e) => onSelectProject(e.target.value)}
                className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
                {projects.map(project => (
                    <option key={project.id} value={project.id}>
                        {project.title || 'Unbenanntes Projekt'}
                    </option>
                ))}
            </select>

            <button
                onClick={onNewProject}
                title="Neues Projekt erstellen"
                className="p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 rounded-md transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
            </button>
             <button
                onClick={handleDelete}
                title="Aktuelles Projekt löschen"
                className="p-2 text-slate-500 hover:bg-slate-100 hover:text-red-600 rounded-md transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    );
};

export default ProjectSwitcher;
