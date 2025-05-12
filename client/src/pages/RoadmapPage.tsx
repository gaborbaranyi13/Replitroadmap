import React, { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useRoadmap } from "@/contexts/RoadmapContext";
import Layout from "@/components/Layout";
import LoadingOverlay from "@/components/LoadingOverlay";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  ArrowLeft, 
  FileText, 
  LightbulbIcon,
  Share2
} from "lucide-react";

const RoadmapPage: React.FC = () => {
  const { roadmapData, isLoading, toggleSectionExpansion, resetRoadmap } = useRoadmap();
  const [location, setLocation] = useLocation();
  
  useEffect(() => {
    if (!roadmapData && !isLoading) {
      setLocation("/");
    }
  }, [roadmapData, isLoading, setLocation]);

  if (!roadmapData) {
    return <LoadingOverlay isVisible={isLoading} />;
  }

  return (
    <Layout>
      <LoadingOverlay isVisible={isLoading} />
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          className="bg-white shadow-lg rounded-xl p-6 mb-10 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <Link 
                href="/" 
                className="inline-flex items-center gap-1.5 mb-3 text-gray-500 hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Business Roadmap for:
                <span className="text-primary block sm:inline mt-1 sm:mt-0 sm:ml-2">
                  {roadmapData.businessIdea}
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button 
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `Business Roadmap for ${roadmapData.businessIdea}`,
                      text: `Check out this business roadmap for ${roadmapData.businessIdea}`,
                      url: window.location.href
                    }).catch((error) => console.log('Error sharing', error));
                  }
                }}
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Share</span>
              </button>
              <button 
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => {
                  resetRoadmap();
                  setLocation("/");
                }}
                aria-label="Create new roadmap"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">New Roadmap</span>
              </button>
            </div>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md text-blue-700">
            <p className="text-sm md:text-base">
              Below is your comprehensive roadmap with 10 key sections. Click on each section to expand and see the subtopics.
              Click on any subtopic to view detailed information with actionable steps.
            </p>
          </div>
        </motion.div>

        <div className="space-y-6">
          {roadmapData.sections.map((section, index) => (
            <motion.div 
              key={section.id}
              className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
            >
              <div 
                className={`p-6 cursor-pointer flex justify-between items-center transition-colors ${
                  section.isExpanded ? "bg-primary/5" : "hover:bg-gray-50"
                }`}
                onClick={() => toggleSectionExpansion(section.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="hidden md:flex h-12 w-12 rounded-full bg-primary/10 items-center justify-center text-primary flex-shrink-0 mt-1">
                    <span className="font-bold text-lg">{index + 1}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                    <p className="text-gray-600 mt-1.5 pr-8">{section.description}</p>
                  </div>
                </div>
                <div className={`text-gray-400 transition-colors ${section.isExpanded ? "text-primary" : ""}`}>
                  {section.isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                </div>
              </div>
              
              <AnimatePresence>
                {section.isExpanded && (
                  <motion.div 
                    className="border-t border-gray-100"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {section.subtopics.map((subtopic, subtopicIndex) => (
                        <Link 
                          key={subtopic.id}
                          href={`/detail/${subtopic.id}`}
                          className="block p-5 rounded-lg border border-gray-200 hover:border-primary/50 hover:shadow-md transition-all group"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                                {subtopicIndex + 1}
                              </div>
                              <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                                {subtopic.title}
                              </h3>
                            </div>
                            <FileText className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                          </div>
                          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                            {subtopic.description}
                          </p>
                          <div className="mt-3 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            <span>View details</span>
                            <ArrowLeft className="w-3 h-3 rotate-180" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-10 bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="hidden sm:block">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                <LightbulbIcon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Want to explore another business idea?</h3>
              <p className="text-gray-600 mb-4">
                Generate a new roadmap for a different business concept or try refining your current idea.
              </p>
              <button 
                onClick={() => {
                  resetRoadmap();
                  setLocation("/");
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Create New Roadmap</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RoadmapPage;
