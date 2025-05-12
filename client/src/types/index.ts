export interface Subtopic {
  id: string;
  title: string;
  description: string;
}

export interface RoadmapSection {
  id: string;
  title: string;
  description: string;
  subtopics: Subtopic[];
  isExpanded: boolean;
}

export interface RoadmapData {
  businessIdea: string;
  sections: RoadmapSection[];
}

export interface DetailContent {
  title: string;
  section: string;
  content: string;
  suggestions?: ApproachSuggestion[];
}

export interface ApproachSuggestion {
  id: string;
  title: string;
  description: string;
  approachType: 'innovative' | 'traditional' | 'cost-effective' | 'technical' | 'creative';
}
