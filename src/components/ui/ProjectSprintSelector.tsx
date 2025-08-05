"use client";

import React, { useState } from 'react';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'completed';
  team: string;
  technology: string[];
}

export interface Sprint {
  id: string;
  name: string;
  projectId: string;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'active' | 'completed';
  goals: string[];
}

interface ProjectSprintSelectorProps {
  projects: Project[];
  sprints: Sprint[];
  selectedProject?: Project;
  selectedSprint?: Sprint;
  onProjectChange: (project: Project) => void;
  onSprintChange: (sprint: Sprint) => void;
  className?: string;
}

export function ProjectSprintSelector({
  projects,
  sprints,
  selectedProject,
  selectedSprint,
  onProjectChange,
  onSprintChange,
  className = ''
}: ProjectSprintSelectorProps) {
  const [projectSearch, setProjectSearch] = useState('');
  const [sprintSearch, setSprintSearch] = useState('');

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
    project.team.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const availableSprints = selectedProject 
    ? sprints.filter(sprint => sprint.projectId === selectedProject.id)
    : [];

  const filteredSprints = availableSprints.filter(sprint =>
    sprint.name.toLowerCase().includes(sprintSearch.toLowerCase())
  );

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Project Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Project/Application
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects..."
              value={projectSearch}
              onChange={(e) => setProjectSearch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {filteredProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    onProjectChange(project);
                    setProjectSearch(project.name);
                  }}
                  className={`w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                    selectedProject?.id === project.id ? 'bg-blue-50 text-blue-700' : ''
                  }`}
                >
                  <div className="font-medium text-sm">{project.name}</div>
                  <div className="text-xs text-gray-500">{project.team} • {project.status}</div>
                  {project.technology.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.technology.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="inline-block px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technology.length > 3 && (
                        <span className="text-xs text-gray-400">+{project.technology.length - 3}</span>
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sprint Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Sprint
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder={selectedProject ? "Search sprints..." : "Select a project first"}
              value={sprintSearch}
              onChange={(e) => setSprintSearch(e.target.value)}
              disabled={!selectedProject}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            {selectedProject && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredSprints.map((sprint) => (
                  <button
                    key={sprint.id}
                    onClick={() => {
                      onSprintChange(sprint);
                      setSprintSearch(sprint.name);
                    }}
                    className={`w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                      selectedSprint?.id === sprint.id ? 'bg-blue-50 text-blue-700' : ''
                    }`}
                  >
                    <div className="font-medium text-sm">{sprint.name}</div>
                    <div className="text-xs text-gray-500">
                      {sprint.startDate.toLocaleDateString()} - {sprint.endDate.toLocaleDateString()} • {sprint.status}
                    </div>
                    {sprint.goals.length > 0 && (
                      <div className="text-xs text-gray-400 mt-1">
                        Goals: {sprint.goals.slice(0, 2).join(', ')}
                        {sprint.goals.length > 2 && ' ...'}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Summary */}
      {selectedProject && selectedSprint && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-blue-900">
                {selectedProject.name} • {selectedSprint.name}
              </div>
              <div className="text-xs text-blue-700">
                {selectedProject.team} • {selectedSprint.status} sprint
              </div>
            </div>
            <div className="flex space-x-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                selectedProject.status === 'active' ? 'bg-green-100 text-green-800' : 
                selectedProject.status === 'completed' ? 'bg-gray-100 text-gray-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}>
                {selectedProject.status}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                selectedSprint.status === 'active' ? 'bg-blue-100 text-blue-800' : 
                selectedSprint.status === 'completed' ? 'bg-gray-100 text-gray-800' : 
                'bg-orange-100 text-orange-800'
              }`}>
                {selectedSprint.status}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
