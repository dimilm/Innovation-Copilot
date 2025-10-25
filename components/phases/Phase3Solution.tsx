
import React, { useState } from 'react';
import { PhaseProps, InnovationProject } from '../../types';
import AIAssistChatButton from '../AIAssistChatButton';
import AIAssistModal from '../AIAssistModal';

const Phase3Solution: React.FC<PhaseProps> = ({ project, updateProject }) => {
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        field: keyof InnovationProject | null;
        fieldLabel: string | null;
    }>({ isOpen: false, field: null, fieldLabel: null });

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
                    phase="solution"
                />
            )}
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Phase 3: Die Lösung</h2>
                    <p className="mt-2 text-slate-600">Beschreiben Sie Ihr Produkt oder Ihre Dienstleistung im Detail. Was macht sie einzigartig?</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="usp" className="block text-sm font-medium text-slate-700">Alleinstellungsmerkmal (USP)</label>
                            <AIAssistChatButton onClick={() => handleOpenModal('usp', 'Alleinstellungsmerkmal (USP)')} />
                        </div>
                        <textarea
                            name="usp"
                            id="usp"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={project.usp}
                            onChange={(e) => updateProject({ usp: e.target.value })}
                            placeholder="Was macht Ihre Lösung einzigartig und besser als die der Konkurrenz?"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="coreFeatures" className="block text-sm font-medium text-slate-700">Kernfunktionen</label>
                            <AIAssistChatButton onClick={() => handleOpenModal('coreFeatures', 'Kernfunktionen')} />
                        </div>
                        <textarea
                            name="coreFeatures"
                            id="coreFeatures"
                            rows={5}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={project.coreFeatures}
                            onChange={(e) => updateProject({ coreFeatures: e.target.value })}
                            placeholder="Listen Sie die wichtigsten Funktionen Ihres Angebots auf."
                        />
                    </div>

                    <div>
                         <div className="flex justify-between items-center mb-1">
                            <label htmlFor="keyResources" className="block text-sm font-medium text-slate-700">Schlüsselressourcen</label>
                            <AIAssistChatButton onClick={() => handleOpenModal('keyResources', 'Schlüsselressourcen')} />
                        </div>
                        <textarea
                            name="keyResources"
                            id="keyResources"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={project.keyResources}
                            onChange={(e) => updateProject({ keyResources: e.target.value })}
                            placeholder="Welche Ressourcen sind entscheidend? (z.B. Team, Technologie, Patente, Kapital)"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Phase3Solution;
