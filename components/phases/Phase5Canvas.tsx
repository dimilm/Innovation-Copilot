
import React, { useState, useEffect } from 'react';
import { InnovationProject } from '../../types';
import CanvasBlock from '../canvas/CanvasBlock';
import { generateWithGemini } from '../../services/geminiService';
import Loader from '../Loader';

interface Phase5CanvasProps {
    project: InnovationProject;
}

const Phase5Canvas: React.FC<Phase5CanvasProps> = ({ project }) => {
    const [summaries, setSummaries] = useState<Partial<InnovationProject>>({});
    const [isLoading, setIsLoading] = useState(false);

    const generateAllSummaries = async () => {
        setIsLoading(true);
        const prompt = `
        Basierend auf den folgenden Projektinformationen, fasse jeden Punkt für ein Business Model Canvas zusammen. Antworte mit einem JSON-Objekt mit den Schlüsseln: "keyPartners", "keyActivities", "keyResources", "usp" (Wertversprechen), "customerRelationships", "channels", "targetAudience" (Kundensegmente), "costStructure", "revenueStreams". Halte jede Zusammenfassung kurz und prägnant (Stichpunkte oder 1-2 Sätze).

        PROJEKTINFORMATIONEN:
        Titel: ${project.title}
        Beschreibung: ${project.description}
        Problem: ${project.problem}
        Zielgruppe: ${project.targetAudience}
        Marktgröße: ${project.marketSize}
        Wettbewerber: ${project.competitors}
        USP: ${project.usp}
        Kernfunktionen: ${project.coreFeatures}
        Einnahmequellen: ${project.revenueStreams}
        Kostenstruktur: ${project.costStructure}
        Schlüsselpartner: ${project.keyPartners}
        Schlüsselaktivitäten: ${project.keyActivities}
        Schlüsselressourcen: ${project.keyResources}
        Kundenbeziehungen: ${project.customerRelationships}
        Kanäle: ${project.channels}
        `;

        try {
            const result = await generateWithGemini(prompt);
            const cleanedResult = result.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsedSummaries = JSON.parse(cleanedResult);
            setSummaries(parsedSummaries);
        } catch (error) {
            console.error("Failed to parse AI summary:", error);
            // Fallback to project data if parsing fails
            setSummaries(project);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        // Initially populate with project data
        setSummaries(project);
    }, [project]);


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Phase 5: Business Model Canvas</h2>
                    <p className="mt-2 text-slate-600">Hier ist die Zusammenfassung Ihrer Idee im Business Model Canvas Format. Die AI kann helfen, die Einträge zu verfeinern.</p>
                </div>
                 <button
                    onClick={generateAllSummaries}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                >
                {isLoading ? <Loader/> : (
                <>
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                </svg>
                <span>Canvas verfeinern</span>
                </>)}
            </button>
            </div>
            
            {isLoading && !Object.keys(summaries).length ? (
                <div className="flex justify-center items-center h-96">
                    <Loader />
                </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                <div className="md:col-span-2 grid grid-rows-2 gap-4">
                    <CanvasBlock title="Schlüsselpartner" content={summaries.keyPartners || project.keyPartners} />
                    <div className="grid grid-cols-2 gap-4">
                        <CanvasBlock title="Schlüsselaktivitäten" content={summaries.keyActivities || project.keyActivities} />
                        <CanvasBlock title="Schlüsselressourcen" content={summaries.keyResources || project.keyResources} />
                    </div>
                </div>
                <div className="md:col-span-1">
                    <CanvasBlock title="Wertversprechen (USP)" content={summaries.usp || project.usp} color="bg-indigo-50" />
                </div>
                <div className="md:col-span-2 grid grid-rows-2 gap-4">
                     <div className="grid grid-cols-2 gap-4">
                        <CanvasBlock title="Kundenbeziehungen" content={summaries.customerRelationships || project.customerRelationships} />
                        <CanvasBlock title="Kanäle" content={summaries.channels || project.channels} />
                    </div>
                    <CanvasBlock title="Kundensegmente" content={summaries.targetAudience || project.targetAudience} />
                </div>
                <div className="md:col-span-3">
                     <CanvasBlock title="Kostenstruktur" content={summaries.costStructure || project.costStructure} />
                </div>
                <div className="md:col-span-2">
                     <CanvasBlock title="Einnahmequellen" content={summaries.revenueStreams || project.revenueStreams} />
                </div>
            </div>
            )}
        </div>
    );
};

export default Phase5Canvas;
