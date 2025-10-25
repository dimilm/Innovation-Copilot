
import React from 'react';
import { Phase } from '../types';

interface PhaseStepperProps {
  currentPhase: Phase;
  onPhaseClick: (phase: Phase) => void;
}

const phases: { id: Phase; name: string }[] = [
  { id: 'spark', name: '1. Die Zündung' },
  { id: 'market', name: '2. Markt & Kunde' },
  { id: 'solution', name: '3. Die Lösung' },
  { id: 'business_model', name: '4. Geschäftsmodell' },
  { id: 'canvas', name: '5. Business Canvas' },
];

const PhaseStepper: React.FC<PhaseStepperProps> = ({ currentPhase, onPhaseClick }) => {
  const currentIndex = phases.findIndex(p => p.id === currentPhase);

  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {phases.map((phase, phaseIdx) => (
          <li key={phase.name} className={`relative ${phaseIdx !== phases.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
            {phaseIdx < currentIndex ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-indigo-600" />
                </div>
                <button
                  onClick={() => onPhaseClick(phase.id)}
                  className="relative w-8 h-8 flex items-center justify-center bg-indigo-600 rounded-full hover:bg-indigo-900"
                >
                  <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
                  </svg>
                  <span className="absolute -bottom-7 text-xs text-center w-24 font-medium text-slate-700">{phase.name}</span>
                </button>
              </>
            ) : phaseIdx === currentIndex ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-slate-200" />
                </div>
                <button
                  onClick={() => onPhaseClick(phase.id)}
                  className="relative w-8 h-8 flex items-center justify-center bg-white border-2 border-indigo-600 rounded-full"
                  aria-current="step"
                >
                  <span className="h-2.5 w-2.5 bg-indigo-600 rounded-full" aria-hidden="true" />
                   <span className="absolute -bottom-7 text-xs text-center w-24 font-semibold text-indigo-600">{phase.name}</span>
                </button>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-slate-200" />
                </div>
                <button
                  onClick={() => onPhaseClick(phase.id)}
                  className="group relative w-8 h-8 flex items-center justify-center bg-white border-2 border-slate-300 rounded-full hover:border-slate-400"
                >
                  <span className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-slate-300" aria-hidden="true" />
                   <span className="absolute -bottom-7 text-xs text-center w-24 font-medium text-slate-500">{phase.name}</span>
                </button>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default PhaseStepper;
