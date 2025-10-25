
import React, { useState, useEffect, useRef } from 'react';
import { createChat } from '../services/geminiService';
import { InnovationProject, ChatMessage, Phase } from '../types';
import { Chat } from '@google/genai';
import Loader from './Loader';

interface AIAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (finalText: string) => void;
  project: InnovationProject;
  field: keyof InnovationProject;
  fieldLabel: string;
  phase: Phase;
}

const getSystemInstruction = (fieldLabel: string, project: InnovationProject, phase: Phase): string => {
    let agentPersona = "";
    switch(phase) {
        case 'spark':
            agentPersona = "Du bist ein kreativer Coach für Ideenfindung. Deine Aufgabe ist es, dem Benutzer zu helfen, seine Grundidee zu schärfen.";
            break;
        case 'market':
            agentPersona = "Du bist ein scharfsinniger Marktanalyst. Deine Aufgabe ist es, dem Benutzer zu helfen, seinen Markt, seine Kunden und seine Konkurrenten zu verstehen.";
            break;
        case 'solution':
            agentPersona = "Du bist ein erfahrener Produktmanager. Deine Aufgabe ist es, dem Benutzer zu helfen, eine überzeugende Lösung mit klaren Vorteilen zu definieren.";
            break;
        case 'business_model':
            agentPersona = "Du bist ein strategischer Geschäftsmodell-Berater. Deine Aufgabe ist es, dem Benutzer zu helfen, ein nachhaltiges und profitables Geschäftsmodell zu entwickeln.";
            break;
        default:
            agentPersona = "Du bist ein hilfsbereiter Startup-Coach.";
    }

    return `${agentPersona} Du unterstützt bei der Ausarbeitung des Abschnitts "${fieldLabel}" für das Geschäftskonzept "${project.title || 'Noch nicht definiert'}".

Beginne das Gespräch, indem du eine offene, leitende Frage stellst, die auf den Abschnitt "${fieldLabel}" zugeschnitten ist. Gib Beispiele, mache Vorschläge und verfeinere den Text gemeinsam mit dem Benutzer.

Wenn du glaubst, eine gute, finale Version des Textes entwickelt zu haben, präsentiere sie dem Benutzer deutlich. Formatiere diese finale Version ausschließlich innerhalb von [FINAL_ANSWER]...[/FINAL_ANSWER] Blöcken. Gib keinen Text nach dem schließenden Block aus. Dies hilft dem Benutzer, den Vorschlag zu übernehmen.`;
};


const AIAssistModal: React.FC<AIAssistModalProps> = ({ isOpen, onClose, onConfirm, project, field, fieldLabel, phase }) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [conversation, setConversation] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [finalAnswer, setFinalAnswer] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            const initialText = project[field];
            setFinalAnswer(initialText);
            const systemInstruction = getSystemInstruction(fieldLabel, project, phase);
            const chatSession = createChat(systemInstruction);
            setChat(chatSession);

            const startMessage = initialText 
                ? `Hier ist mein aktueller Entwurf für "${fieldLabel}": "${initialText}". Kannst du mir helfen, diesen zu verbessern?`
                : "Ich brauche Hilfe, um diesen Abschnitt zu starten. Kannst du mir eine erste Frage stellen?";

            sendMessage(startMessage, chatSession);
        } else {
            // Reset state on close
            setConversation([]);
            setChat(null);
            setUserInput('');
            setIsLoading(false);
        }
    }, [isOpen, phase]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [conversation]);

    const parseFinalAnswer = (text: string) => {
        const match = text.match(/\[FINAL_ANSWER\]([\s\S]*)\[\/FINAL_ANSWER\]/);
        if (match && match[1]) {
            setFinalAnswer(match[1].trim());
        }
    };

    const sendMessage = async (message: string, currentChat: Chat | null) => {
        if (!currentChat) return;

        setIsLoading(true);
        if(message !== "Ich brauche Hilfe, um diesen Abschnitt zu starten. Kannst du mir eine erste Frage stellen?") {
            setConversation(prev => [...prev, { role: 'user', text: message }]);
        }

        try {
            const result = await currentChat.sendMessage({ message });
            parseFinalAnswer(result.text);
            const modelResponse = result.text.replace(/\[FINAL_ANSWER\][\s\S]*\[\/FINAL_ANSWER\]/, '').trim();
            if (modelResponse) {
                setConversation(prev => [...prev, { role: 'model', text: modelResponse }]);
            }
        } catch (error) {
            console.error("Chat error:", error);
            setConversation(prev => [...prev, { role: 'model', text: "Entschuldigung, es ist ein Fehler aufgetreten." }]);
        } finally {
            setIsLoading(false);
            setUserInput('');
        }
    };

    const handleUserMessageSend = () => {
        if (userInput.trim() && !isLoading) {
            sendMessage(userInput, chat);
        }
    }
    
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleUserMessageSend();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserMessageSend();
        }
    };
    
    const handleConfirm = () => {
        onConfirm(finalAnswer);
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col">
                <header className="p-4 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800">AI Assistent: <span className="text-indigo-600">{fieldLabel}</span></h3>
                    <p className="text-sm text-slate-500">Chatten Sie mit der AI, um diesen Abschnitt zu perfektionieren.</p>
                </header>

                <div className="flex-1 p-4 overflow-y-auto bg-slate-50" ref={chatContainerRef}>
                    <div className="space-y-4">
                        {conversation.map((msg, index) => (
                            msg.text && (
                                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-lg px-4 py-2 rounded-xl whitespace-pre-wrap ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-800'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            )
                        ))}
                        {isLoading && (conversation.length === 0 || conversation[conversation.length - 1]?.role === 'user') && (
                            <div className="flex justify-start">
                                <div className="max-w-lg px-4 py-2 rounded-xl bg-slate-200 text-slate-800">
                                    <Loader />
                                 </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t border-slate-200 bg-white">
                    <label htmlFor="finalAnswer" className="text-sm font-medium text-slate-700">Vorschlag der AI (editierbar):</label>
                    <textarea 
                        id="finalAnswer"
                        rows={4}
                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={finalAnswer}
                        onChange={(e) => setFinalAnswer(e.target.value)}
                        placeholder="Der finale Vorschlag der AI erscheint hier..."
                    />
                </div>

                <form onSubmit={handleFormSubmit} className="p-4 border-t border-slate-200 bg-white">
                    <div className="flex items-end space-x-2">
                        <textarea
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={2}
                            className="flex-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-slate-50 resize-none"
                            placeholder="Ihre Antwort... (Shift+Enter für Zeilenumbruch)"
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !userInput.trim()} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            Senden
                        </button>
                    </div>
                </form>

                <footer className="p-4 flex justify-end space-x-3 bg-slate-50 rounded-b-2xl">
                    <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
                        Abbrechen
                    </button>
                    <button onClick={handleConfirm} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                        Übernehmen & Schließen
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default AIAssistModal;
