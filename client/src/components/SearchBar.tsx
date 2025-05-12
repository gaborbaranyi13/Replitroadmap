import React, { useState } from "react";
import { useRoadmap } from "@/contexts/RoadmapContext";
import { Map, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

const SearchBar: React.FC = () => {
  const [businessIdea, setBusinessIdea] = useState("");
  const { generateBusinessRoadmap, isLoading, error } = useRoadmap();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessIdea.trim()) {
      return;
    }
    
    await generateBusinessRoadmap(businessIdea);
    setLocation("/roadmap");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form 
        className="flex flex-col sm:flex-row gap-3 p-1.5 bg-white/10 backdrop-blur-md rounded-xl"
        onSubmit={handleSubmit}
      >
        <input 
          type="text" 
          placeholder="Enter your business idea (e.g., 'A sustainable coffee shop')"
          value={businessIdea}
          onChange={(e) => setBusinessIdea(e.target.value)}
          className="flex-grow px-4 py-3 sm:py-4 bg-white/90 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm transition-shadow" 
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="px-6 py-3 sm:py-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isLoading || !businessIdea.trim()}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Map className="w-5 h-5" />
          )}
          <span>Generate Roadmap</span>
        </button>
      </form>
      
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
