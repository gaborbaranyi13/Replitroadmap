import React from 'react';
import { ApproachSuggestion } from '@/types';
import { useRoadmap } from '@/contexts/RoadmapContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

// Map of approach types to colors and icons
const approachStyles: Record<string, { bgColor: string, textColor: string, icon: string }> = {
  'innovative': {
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-800',
    icon: '💡'
  },
  'traditional': {
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    icon: '📝'
  },
  'cost-effective': {
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    icon: '💰'
  },
  'technical': {
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-800',
    icon: '⚙️'
  },
  'creative': {
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    icon: '✨'
  }
};

interface SuggestionChipsProps {
  suggestions: ApproachSuggestion[];
  subtopicId: string;
  businessIdea: string;
}

const SuggestionChips: React.FC<SuggestionChipsProps> = ({ suggestions, subtopicId, businessIdea }) => {
  const { getDetailContent } = useRoadmap();
  const { toast } = useToast();
  
  // Handle chip click - call the API with a custom prompt
  const handleChipClick = async (suggestion: ApproachSuggestion) => {
    try {
      // Apply the selected approach
      await getDetailContent(subtopicId, true, suggestion.approachType);
      
      toast({
        title: `${suggestion.approachType.charAt(0).toUpperCase() + suggestion.approachType.slice(1)} Approach`,
        description: `Showing ${suggestion.title.toLowerCase()} approach for this topic`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error applying suggestion:", error);
      toast({
        title: "Error",
        description: "Failed to apply this approach. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // No suggestions to display
  if (!suggestions || suggestions.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-6 pt-4">
      <p className="text-sm text-gray-500 mb-3">Alternative approaches:</p>
      
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => {
          const style = approachStyles[suggestion.approachType] || approachStyles['innovative'];
          
          return (
            <motion.button
              key={suggestion.id}
              className={`px-3 py-2 rounded-full ${style.bgColor} ${style.textColor} text-sm font-medium 
                inline-flex items-center gap-1.5 hover:brightness-95 transition-all`}
              onClick={() => handleChipClick(suggestion)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
            >
              <span>{style.icon}</span>
              <span>{suggestion.title}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestionChips;