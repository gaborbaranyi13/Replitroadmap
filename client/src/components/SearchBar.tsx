import React, { useState } from "react";
import { useRoadmap } from "@/contexts/RoadmapContext";
import { LightbulbIcon, Loader2, ArrowRight } from "lucide-react";
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
      <motion.form 
        className="flex flex-col sm:flex-row gap-3 p-2 bg-white/20 backdrop-blur-md rounded-xl shadow-lg"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <LightbulbIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Enter your business idea (e.g., 'A sustainable coffee shop')"
            value={businessIdea}
            onChange={(e) => setBusinessIdea(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all" 
            disabled={isLoading}
          />
        </div>
        <button 
          type="submit" 
          className="px-6 py-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg shadow-md flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isLoading || !businessIdea.trim()}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ArrowRight className="w-5 h-5" />
          )}
          <span>{isLoading ? "Generating..." : "Generate Roadmap"}</span>
        </button>
      </motion.form>
      
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-lg shadow-sm"
          >
            <div className="font-medium">Error</div>
            <div>{error}</div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="mt-4 text-white/80 text-center text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Try specific ideas like "organic bakery", "mobile app for fitness", or "online tutoring platform"
      </motion.div>
    </div>
  );
};

export default SearchBar;
