import React from "react";
import { LightbulbIcon, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  message = "Our AI is analyzing your business idea and generating a comprehensive roadmap. This may take a moment..." 
}) => {
  return (
    <motion.div 
      className={cn(
        "fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center",
        isVisible ? "visible" : "hidden"
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center">
        <div className="relative mb-6 flex justify-center">
          <div className="absolute animate-ping w-16 h-16 rounded-full bg-primary/20"></div>
          <div className="relative z-10 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Brain className="w-8 h-8 text-primary animate-pulse" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-3">Creating Your Roadmap</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex justify-center items-center gap-1.5 mb-2">
          <motion.div 
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 1, 
              repeat: Infinity,
              repeatType: "loop",
              delay: 0
            }}
          />
          <motion.div 
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 1, 
              repeat: Infinity,
              repeatType: "loop",
              delay: 0.2
            }}
          />
          <motion.div 
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 1, 
              repeat: Infinity,
              repeatType: "loop",
              delay: 0.4
            }}
          />
        </div>
        
        <p className="text-xs text-gray-400">This may take up to 30 seconds</p>
      </div>
    </motion.div>
  );
};

export default LoadingOverlay;
