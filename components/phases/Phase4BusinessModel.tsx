
import React, { useState } from 'react';
import { PhaseProps, InnovationProject } from '../../types';
import AIAssistChatButton from '../AIAssistChatButton';
import AIAssistModal from '../AIAssistModal';

const Phase4BusinessModel: React.FC<PhaseProps> = ({ project, updateProject }) => {
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
                    phase="business_model"
                />
            )}
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Phase 4: Geschäftsmodell</h2>
                    <p className="mt-2 text-slate-600">Wie wird Ihre Idee Geld verdienen und welche Kosten fallen an?</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="revenueStreams" className="block text-sm font-medium text-slate-700">Einnahmequellen</label>
                            <AIAssistChatButton onClick={() => handleOpenModal('revenueStreams', 'Einnahmequellen')} />
                        </div>
                        <textarea
                            name="revenueStreams"
                            id="revenueStreams"
                            rows={4}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={project.revenueStreams}
                            onChange={(e) => updateProject({ revenueStreams: e.target.value })}
                            placeholder="Wie generieren Sie Umsatz? (z.B. Verkäufe, Abos, Lizenzen, Werbung)"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="costStructure" className="block text-sm font-medium text-slate-700">Kostenstruktur</label>
                            <AIAssistChatButton onClick={() => handleOpenModal('costStructure', 'Kostenstruktur')} />
                        </div>
                        <textarea
                            name="costStructure"
                            id="costStructure"
                            rows={4}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={project.costStructure}
                            onChange={(e) => updateProject({ costStructure: e.target.value })}
                            placeholder="Was sind die wichtigsten Kostenpunkte? (z.B. Personal, Marketing, Entwicklung)"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="keyPartners" className="block text-sm font-medium text-slate-700">Schlüsselpartner</label>
                            <AIAssistChatButton onClick={() => handleOpenModal('keyPartners', 'Schlüsselpartner')} />
                        </div>
                        <textarea
                            name="keyPartners"
                            id="keyPartners"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={project.keyPartners}
                            onChange={(e) => updateProject({ keyPartners: e.target.value })}
                            placeholder="Wer sind wichtige Partner oder Lieferanten?"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="keyActivities" className="block text-sm font-medium text-slate-700">Schlüsselaktivitäten</label>
                            <AIAssistChatButton onClick={() => handleOpenModal('keyActivities', 'Schlüsselaktivitäten')} />
                        </div>
                        <textarea
                            name="keyActivities"
                            id="keyActivities"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={project.keyActivities}
                            onChange={(e) => updateProject({ keyActivities: e.target.value })}
                            placeholder="Was sind die wichtigsten Tätigkeiten, um das Geschäftsmodell umzusetzen?"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Phase4BusinessModel;
