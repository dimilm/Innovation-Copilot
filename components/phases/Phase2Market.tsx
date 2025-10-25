
import React, { useState } from 'react';
import { PhaseProps, InnovationProject } from '../../types';
import AIAssistChatButton from '../AIAssistChatButton';
import AIAssistModal from '../AIAssistModal';

const Phase2Market: React.FC<PhaseProps> = ({ project, updateProject }) => {
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
                    phase="market"
                />
            )}
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Phase 2: Markt & Kunde</h2>
                    <p className="mt-2 text-slate-600">Verstehen Sie das Umfeld Ihrer Idee. Wer sind Ihre Kunden und Konkurrenten?</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800">Kundenprofil</h3>
                        <p className="text-sm text-slate-500 mb-2">Die Zielgruppe aus Phase 1 war: "{project.targetAudience || 'Nicht definiert'}"</p>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="customerRelationships" className="block text-sm font-medium text-slate-700">Kundenbeziehungen</label>
                            <AIAssistChatButton onClick={() => handleOpenModal('customerRelationships', 'Kundenbeziehungen')} />
                        </div>
                        <textarea
                            name="customerRelationships"
                            id="customerRelationships"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={project.customerRelationships}
                            onChange={(e) => updateProject({ customerRelationships: e.target.value })}
                            placeholder="Wie interagieren Sie mit Ihren Kunden? (z.B. Persönlich, Self-Service, Community)"
                        />
                    </div>
                     <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="channels" className="block text-sm font-medium text-slate-700">Kanäle</label>
                            <AIAssistChatButton onClick={() => handleOpenModal('channels', 'Kanäle')} />
                        </div>
                        <textarea
                            name="channels"
                            id="channels"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={project.channels}
                            onChange={(e) => updateProject({ channels: e.target.value })}
                            placeholder="Wie erreichen Sie Ihre Kunden? (z.B. Website, Social Media, Partner)"
                        />
                    </div>

                    <hr/>

                    <div>
                        <h3 className="text-lg font-semibold text-slate-800">Marktanalyse</h3>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="marketSize" className="block text-sm font-medium text-slate-700">Marktgröße & Potenzial</label>
                            <AIAssistChatButton onClick={() => handleOpenModal('marketSize', 'Marktgröße & Potenzial')} />
                        </div>
                        <textarea
                            name="marketSize"
                            id="marketSize"
                            rows={4}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={project.marketSize}
                            onChange={(e) => updateProject({ marketSize: e.target.value })}
                            placeholder="Wie groß ist der Markt? Gibt es Wachstumstrends?"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="competitors" className="block text-sm font-medium text-slate-700">Wettbewerber</label>
                             <AIAssistChatButton onClick={() => handleOpenModal('competitors', 'Wettbewerber')} />
                        </div>
                        <textarea
                            name="competitors"
                            id="competitors"
                            rows={4}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={project.competitors}
                            onChange={(e) => updateProject({ competitors: e.target.value })}
                            placeholder="Wer sind Ihre Hauptkonkurrenten? Was machen sie gut/schlecht?"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Phase2Market;
