export type Phase = 'spark' | 'market' | 'solution' | 'business_model' | 'canvas';

export interface InnovationProject {
  id: string;
  phase: Phase;
  title: string;
  description: string;
  problem: string;
  targetAudience: string;
  marketSize: string;
  competitors: string;
  usp: string;
  coreFeatures: string;
  revenueStreams: string;
  costStructure: string;
  keyPartners: string;
  keyActivities: string;
  keyResources: string;
  customerRelationships: string;
  channels: string;
}

export interface PhaseProps {
    project: InnovationProject;
    updateProject: (data: Partial<InnovationProject>) => void;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
