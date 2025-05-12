import React, { createContext, useState, useContext, ReactNode } from "react";
import { RoadmapData, DetailContent } from "@/types";
import { generateRoadmap, generateDetailContent } from "@/utils/geminiApi";
import { useToast } from "@/hooks/use-toast";

interface RoadmapContextType {
  roadmapData: RoadmapData | null;
  detailContent: DetailContent | null;
  isLoading: boolean;
  error: string | null;
  generateBusinessRoadmap: (businessIdea: string) => Promise<void>;
  getDetailContent: (subtopicId: string) => Promise<void>;
  toggleSectionExpansion: (sectionId: string) => void;
  resetRoadmap: () => void;
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

export const RoadmapProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [detailContent, setDetailContent] = useState<DetailContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateBusinessRoadmap = async (businessIdea: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setDetailContent(null);
      
      const data = await generateRoadmap(businessIdea);
      setRoadmapData(data);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to generate roadmap. Please try again.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDetailContent = async (subtopicId: string) => {
    if (!roadmapData) {
      setError("No roadmap data available. Please generate a roadmap first.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Find the subtopic
      let subtopic;
      for (const section of roadmapData.sections) {
        const found = section.subtopics.find(sub => sub.id === subtopicId);
        if (found) {
          subtopic = found;
          break;
        }
      }

      if (!subtopic) {
        throw new Error(`Subtopic ${subtopicId} not found.`);
      }

      const content = await generateDetailContent(
        subtopicId,
        roadmapData.businessIdea,
        subtopic.title
      );
      
      setDetailContent(content);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to generate detail content. Please try again.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSectionExpansion = (sectionId: string) => {
    if (!roadmapData) return;

    setRoadmapData({
      ...roadmapData,
      sections: roadmapData.sections.map(section => {
        if (section.id === sectionId) {
          return { ...section, isExpanded: !section.isExpanded };
        }
        return section;
      })
    });
  };

  const resetRoadmap = () => {
    setRoadmapData(null);
    setDetailContent(null);
    setError(null);
  };

  return (
    <RoadmapContext.Provider
      value={{
        roadmapData,
        detailContent,
        isLoading,
        error,
        generateBusinessRoadmap,
        getDetailContent,
        toggleSectionExpansion,
        resetRoadmap
      }}
    >
      {children}
    </RoadmapContext.Provider>
  );
};

export const useRoadmap = () => {
  const context = useContext(RoadmapContext);
  if (context === undefined) {
    throw new Error("useRoadmap must be used within a RoadmapProvider");
  }
  return context;
};
