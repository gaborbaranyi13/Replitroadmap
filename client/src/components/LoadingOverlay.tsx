import React from "react";
import { Map } from "lucide-react";
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
        "fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center",
        isVisible ? "visible" : "hidden"
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="mb-4 flex justify-center">
          <Map className="w-12 h-12 animate-pulse text-primary-500" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Creating Your Roadmap</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
          <motion.div 
            className="bg-primary-600 h-1.5 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "70%" }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingOverlay;
