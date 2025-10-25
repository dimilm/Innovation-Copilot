
import React, { useState } from 'react';
import { PhaseProps, InnovationProject } from '../../types';
import AIAssistChatButton from '../AIAssistChatButton';
import AIAssistModal from '../AIAssistModal';
import { generateFullProject } from '../../services/geminiService';
import Loader from '../Loader';

interface Phase1SparkProps extends PhaseProps {
    projectGenerated: boolean;
    setProjectGenerated: (generated: boolean) => void;
}

const Phase1Spark: React.FC<Phase1SparkProps> = ({ project, updateProject, projectGenerated, setProjectGenerated }) => {
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        field: keyof InnovationProject | null;
        fieldLabel: string | null;
    }>({ isOpen: false, field: null, fieldLabel: null });
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOpenModal = (field: keyof InnovationProject, fieldLabel: string) => {
        setModalState({ isOpen: true, field, fieldLabel });
    };

    const handleCloseModal = () => {
        setModalState({ isOpen: false, field: null, fieldLabel: null });
    };

    const handleConfirm = (text: string) => {
        if (modalState.field) {
            updateProject({ [modalState.field]: text });
        }
        handleCloseModal();
    };

    const handleGenerateProject = async () => {
        if (!project.title || !project.description) {
            setError("Bitte geben Sie einen Titel und eine Beschreibung für Ihre Idee an.");
            return;
        }
        setError(null);
        setIsGenerating(true);
        try {
            const generatedData = await generateFullProject(project.title, project.description);
            updateProject(generatedData);
            setProjectGenerated(true);
        } catch (err) {
            setError("Ein Fehler ist aufgetreten. Die AI konnte das Projekt nicht erstellen.");
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <>
            {modalState.isOpen && modalState.field && modalState.fieldLabel && (
                <AIAssistModal
                    isOpen={modalState.isOpen}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirm}
                    project={project}
                    field={modalState.field}
                    fieldLabel={modalState.fieldLabel}
                    phase="spark"
                />
            )}
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Phase 1: Die Zündung</h2>
                    <p className="mt-2 text-slate-600">
                        {projectGenerated
                            ? "Hier ist der erste Entwurf, den die AI für Sie erstellt hat. Verfeinern Sie die Details."
                            : "Geben Sie Ihrer Idee einen Namen und eine kurze Beschreibung. Die AI kann daraus ein komplettes Geschäftskonzept entwickeln."}
                    </p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Name der Idee</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={project.title}
                            onChange={(e) => updateProject({ title: e.target.value })}
                            placeholder="z.B. KI-gestützter Gartenhelfer"
                            disabled={isGenerating}
                        />
                    </div>

                    <div>
                       <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Kurzbeschreibung (Elevator Pitch)</label>
                        <textarea
                            name="description"
                            id="description"
                            rows={3}
                            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={project.description}
                            onChange={(e) => updateProject({ description: e.target.value })}
                            placeholder="Beschreiben Sie Ihre Idee in wenigen Sätzen."
                            disabled={isGenerating}
                        />
                    </div>
                    
                    {!projectGenerated && (
                        <div className="text-center pt-4">
                            <button
                                onClick={handleGenerateProject}
                                disabled={isGenerating || !project.title || !project.description}
                                className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
                            >
                                {isGenerating ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Projekt wird erstellt...
                                    </>
                                ) : (
                                    <>
                                     <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                                    </svg>
                                    Projekt mit AI erstellen
                                    </>
                                )}
                            </button>
                             {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        </div>
                    )}


                    {projectGenerated && (
                        <div className="space-y-6 border-t border-slate-200 pt-6 animate-fade-in">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label htmlFor="problem" className="block text-sm font-medium text-slate-700">Welches Problem wird gelöst?</label>
                                     <AIAssistChatButton onClick={() => handleOpenModal('problem', 'Problemstellung')} />
                                </div>
                                <textarea
                                    name="problem"
                                    id="problem"
                                    rows={3}
                                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    value={project.problem}
                                    onChange={(e) => updateProject({ problem: e.target.value })}
                                    placeholder="Welchen Schmerzpunkt oder Bedarf adressieren Sie?"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label htmlFor="targetAudience" className="block text-sm font-medium text-slate-700">Wer ist die Zielgruppe?</label>
                                    <AIAssistChatButton onClick={() => handleOpenModal('targetAudience', 'Zielgruppe')} />
                                </div>
                                <textarea
                                    name="targetAudience"
                                    id="targetAudience"
                                    rows={3}
                                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    value={project.targetAudience}
                                    onChange={(e) => updateProject({ targetAudience: e.target.value })}
                                    placeholder="Für wen ist diese Idee gedacht?"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Phase1Spark;
