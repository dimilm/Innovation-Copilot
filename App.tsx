
import React, { useState, useCallback, useEffect } from 'react';
import { InnovationProject, Phase } from './types';
import PhaseStepper from './components/PhaseStepper';
import Phase1Spark from './components/phases/Phase1Spark';
import Phase2Market from './components/phases/Phase2Market';
import Phase3Solution from './components/phases/Phase3Solution';
import Phase4BusinessModel from './components/phases/Phase4BusinessModel';
import Phase5Canvas from './components/phases/Phase5Canvas';
import ProjectSwitcher from './components/ProjectSwitcher';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [projects, setProjects] = useState<InnovationProject[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const createNewProject = (): InnovationProject => ({
    id: `proj_${Date.now()}`,
    phase: 'spark',
    title: 'Neues Projekt',
    description: '',
    summary: '',
    problem: '',
    targetAudience: '',
    marketSize: '',
    competitors: '',
    usp: '',
    coreFeatures: '',
    revenueStreams: '',
    costStructure: '',
    keyPartners: '',
    keyActivities: '',
    keyResources: '',
    customerRelationships: '',
    channels: ''
  });

  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem('innovationProjects');
      if (savedProjects) {
        const parsedProjects: InnovationProject[] = JSON.parse(savedProjects);
        if (parsedProjects.length > 0) {
          setProjects(parsedProjects);
          const lastProjectId = localStorage.getItem('lastProjectId');
          setCurrentProjectId(lastProjectId && parsedProjects.some(p => p.id === lastProjectId) ? lastProjectId : parsedProjects[0].id);
        } else {
           const newProject = createNewProject();
           setProjects([newProject]);
           setCurrentProjectId(newProject.id);
        }
      } else {
        const newProject = createNewProject();
        setProjects([newProject]);
        setCurrentProjectId(newProject.id);
      }
    } catch (error) {
        console.error("Failed to load projects from local storage:", error);
        const newProject = createNewProject();
        setProjects([newProject]);
        setCurrentProjectId(newProject.id);
    }
    setIsInitialLoad(false);
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      localStorage.setItem('innovationProjects', JSON.stringify(projects));
      if(currentProjectId) {
         localStorage.setItem('lastProjectId', currentProjectId);
      }
    }
  }, [projects, currentProjectId, isInitialLoad]);

  const currentProject = projects.find(p => p.id === currentProjectId);

  const [projectGenerated, setProjectGenerated] = useState(false);
   useEffect(() => {
    if (currentProject) {
      // Check if project has enough data to be considered "generated"
      setProjectGenerated(!!(currentProject.problem && currentProject.targetAudience));
    }
  }, [currentProject]);


  const updateProject = useCallback((data: Partial<InnovationProject>) => {
    setProjects(prevProjects =>
      prevProjects.map(p =>
        p.id === currentProjectId ? { ...p, ...data } : p
      )
    );
  }, [currentProjectId]);

  const handleSetPhase = (phase: Phase) => {
    if(currentProject && currentProject.phase !== phase) {
      updateProject({ phase });
    }
  };

  const handleNewProject = () => {
    const newProject = createNewProject();
    setProjects(prev => [...prev, newProject]);
    setCurrentProjectId(newProject.id);
  };

  const handleDeleteProject = (projectId: string) => {
    if (projects.length <= 1) {
        alert("Sie können nicht das letzte Projekt löschen.");
        return;
    }
    if (window.confirm("Sind Sie sicher, dass Sie dieses Projekt löschen möchten?")) {
        const newProjects = projects.filter(p => p.id !== projectId);
        setProjects(newProjects);
        if(currentProjectId === projectId) {
            setCurrentProjectId(newProjects[0].id);
        }
    }
  };

  const renderPhase = () => {
    if (!currentProject) return null;

    switch (currentProject.phase) {
      case 'spark':
        return <Phase1Spark 
                  project={currentProject} 
                  updateProject={updateProject} 
                  projectGenerated={projectGenerated} 
                  setProjectGenerated={setProjectGenerated} 
               />;
      case 'market':
        return <Phase2Market project={currentProject} updateProject={updateProject} />;
      case 'solution':
        return <Phase3Solution project={currentProject} updateProject={updateProject} />;
      case 'business_model':
        return <Phase4BusinessModel project={currentProject} updateProject={updateProject} />;
      case 'canvas':
        return <Phase5Canvas project={currentProject} />;
      default:
        return <Phase1Spark 
                  project={currentProject} 
                  updateProject={updateProject} 
                  projectGenerated={projectGenerated} 
                  setProjectGenerated={setProjectGenerated} 
                />;
    }
  };

  const phases: Phase[] = ['spark', 'market', 'solution', 'business_model', 'canvas'];

  const goToNextPhase = () => {
    if (!currentProject) return;
    const currentIndex = phases.indexOf(currentProject.phase);
    if (currentIndex < phases.length - 1) {
      handleSetPhase(phases[currentIndex + 1]);
    }
  };

  const goToPrevPhase = () => {
    if (!currentProject) return;
    const currentIndex = phases.indexOf(currentProject.phase);
    if (currentIndex > 0) {
      handleSetPhase(phases[currentIndex - 1]);
    }
  };
  
  if (isInitialLoad || !currentProject) {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
            <Loader />
        </div>
    );
  }

  const currentIndex = phases.indexOf(currentProject.phase);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <svg className="w-8 h-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a7.5 7.5 0 0 1-7.5 0c-1.421-.492-2.682-.908-3.75-1.433m15 0c-1.068.525-2.329.941-3.75 1.433m-7.5 0a7.5 7.5 0 0 0 7.5 0m-7.5 0a7.5 7.5 0 0 1 7.5 0M12 3v1.5m0 0a6.01 6.01 0 0 0-1.5.189m1.5-.189a6.01 6.01 0 0 1 1.5.189m-3.75-3.478a12.06 12.06 0 0 1 4.5 0m-3.75 2.311a7.5 7.5 0 0 1 7.5 0c1.421.492 2.682.908 3.75 1.433m-15 0c1.068-.525 2.329-.941 3.75-1.433m7.5 0a7.5 7.5 0 0 0-7.5 0m7.5 0a7.5 7.5 0 0 1-7.5 0" />
            </svg>
            <h1 className="text-2xl font-bold text-slate-900">Innovation Catalyst</h1>
          </div>
           <ProjectSwitcher 
                projects={projects}
                currentProjectId={currentProjectId}
                onSelectProject={setCurrentProjectId}
                onNewProject={handleNewProject}
                onDeleteProject={handleDeleteProject}
            />
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PhaseStepper currentPhase={currentProject.phase} onPhaseClick={handleSetPhase} />
        
        <div className="mt-8 bg-white p-6 sm:p-8 rounded-2xl shadow-lg transition-all duration-300">
          {renderPhase()}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={goToPrevPhase}
            disabled={currentIndex === 0}
            className="px-6 py-3 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Zurück
          </button>
          <button
            onClick={goToNextPhase}
            disabled={currentIndex === phases.length - 1}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Weiter
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;