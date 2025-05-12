import React, { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useRoadmap } from "@/contexts/RoadmapContext";
import Layout from "@/components/Layout";
import LoadingOverlay from "@/components/LoadingOverlay";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";

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
          className="bg-white shadow-card rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold">Business Roadmap: <span className="text-primary-600">{roadmapData.businessIdea}</span></h1>
            <button 
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => {
                resetRoadmap();
                setLocation("/");
              }}
              aria-label="Reset roadmap"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600">Below is your comprehensive roadmap with 10 key sections. Click on each section to expand and see the subtopics. Click on any subtopic to view detailed information.</p>
        </motion.div>

        {roadmapData.sections.map((section, index) => (
          <motion.div 
            key={section.id}
            className="bg-white shadow-card rounded-xl mb-4 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 * index }}
          >
            <div 
              className="p-6 cursor-pointer flex justify-between items-center"
              onClick={() => toggleSectionExpansion(section.id)}
            >
              <div>
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <p className="text-gray-600 mt-1">{section.description}</p>
              </div>
              <div className="text-gray-400">
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
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.subtopics.map((subtopic) => (
                      <Link 
                        key={subtopic.id}
                        href={`/detail/${subtopic.id}`}
                        className="block p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 group"
                      >
                        <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">{subtopic.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{subtopic.description}</p>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </Layout>
  );
};

export default RoadmapPage;
