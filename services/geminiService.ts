
import { GoogleGenAI, Chat, Type } from "@google/genai";
import { InnovationProject } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const defaultSystemInstruction = "Du bist ein erfahrener Startup-Berater und Innovationsmanager. Deine Antworten sind prägnant, professionell und auf Deutsch. Konzentriere dich darauf, umsetzbare und kreative Vorschläge zu machen.";


export const generateWithGemini = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.7,
                topP: 0.95,
                topK: 64,
                systemInstruction: defaultSystemInstruction,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "Es gab einen Fehler bei der Kommunikation mit der AI. Bitte versuchen Sie es später erneut.";
    }
};

// For the new conversational UI
export const createChat = (systemInstruction: string): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction,
            temperature: 0.8,
        },
    });
};

// For the new full project generation
export const generateFullProject = async (title: string, description: string): Promise<any> => {
    const projectSchema = {
        type: Type.OBJECT,
        properties: {
            problem: { type: Type.STRING, description: "Das spezifische Problem, das die Idee löst." },
            targetAudience: { type: Type.STRING, description: "Die primäre Zielgruppe für diese Idee." },
            marketSize: { type: Type.STRING, description: "Eine Schätzung der Marktgröße und des Potenzials." },
            competitors: { type: Type.STRING, description: "Die Hauptwettbewerber und ihre Schwächen." },
            usp: { type: Type.STRING, description: "Das Alleinstellungsmerkmal, das die Lösung von anderen unterscheidet." },
            coreFeatures: { type: Type.STRING, description: "Die 3-5 Kernfunktionen des Produkts oder der Dienstleistung als Stichpunkte." },
            revenueStreams: { type: Type.STRING, description: "Mögliche Einnahmequellen." },
            costStructure: { type: Type.STRING, description: "Die wichtigsten Kostenpunkte." },
            keyPartners: { type: Type.STRING, description: "Potenzielle Schlüsselpartner." },
            keyActivities: { type: Type.STRING, description: "Die wichtigsten Aktivitäten zur Umsetzung." },
            keyResources: { type: Type.STRING, description: "Die entscheidenden Ressourcen (Team, Technologie, etc.)." },
            customerRelationships: { type: Type.STRING, description: "Die Art der Beziehung zu den Kunden." },
            channels: { type: Type.STRING, description: "Die Kanäle, um die Kunden zu erreichen." },
        }
    };

    const prompt = `
    Erstelle ein umfassendes Geschäftskonzept basierend auf der folgenden Idee. Fülle alle Felder des bereitgestellten JSON-Schemas aus. Sei kreativ, strategisch und realistisch.
    
    Ideen-Titel: "${title}"
    
    Kurzbeschreibung: "${description}"

    Gib deine Antwort ausschließlich als JSON-Objekt zurück, das dem Schema entspricht.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro', // Using a more powerful model for this complex task
            contents: prompt,
            config: {
                temperature: 0.8,
                responseMimeType: "application/json",
                responseSchema: projectSchema,
            },
        });
        
        let jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error generating full project with Gemini:", error);
        throw new Error("Konnte das Projekt nicht mit der AI generieren.");
    }
};

export const generateProjectSummary = async (project: InnovationProject): Promise<string> => {
    const prompt = `
    Basierend auf den folgenden detaillierten Projektinformationen, erstelle eine prägnante Zusammenfassung (Executive Summary) in 2-3 Sätzen. Diese Zusammenfassung sollte die Kernidee, die Zielgruppe und den Hauptnutzen hervorheben.

    PROJEKTINFORMATIONEN:
    Titel: ${project.title}
    Beschreibung: ${project.description}
    Problem: ${project.problem}
    Zielgruppe: ${project.targetAudience}
    USP: ${project.usp}
    Kernfunktionen: ${project.coreFeatures}
    Einnahmequellen: ${project.revenueStreams}

    Erstelle eine flüssige, überzeugende Zusammenfassung.
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.7,
                systemInstruction: defaultSystemInstruction,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating project summary:", error);
        return "Zusammenfassung konnte nicht erstellt werden.";
    }
};