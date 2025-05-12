import React, { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { useRoadmap } from "@/contexts/RoadmapContext";
import Layout from "@/components/Layout";
import LoadingOverlay from "@/components/LoadingOverlay";
import { motion } from "framer-motion";
import { ArrowLeft, Bookmark, Share2, Printer, FileText, AlertTriangle } from "lucide-react";
import ReactMarkdown from "react-markdown";

const DetailPage: React.FC = () => {
  const [match, params] = useRoute("/detail/:subtopicId");
  const { roadmapData, detailContent, isLoading, error, getDetailContent } = useRoadmap();
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  const [currentSubtopicId, setCurrentSubtopicId] = useState<string | null>(null);
  
  useEffect(() => {
    if (match && params?.subtopicId && roadmapData && 
        (!hasAttemptedLoad || params.subtopicId !== currentSubtopicId)) {
      // Only fetch if we haven't attempted yet, or if the subtopic ID changed
      setHasAttemptedLoad(true);
      setCurrentSubtopicId(params.subtopicId);
      getDetailContent(params.subtopicId);
    }
  }, [match, params?.subtopicId, roadmapData, getDetailContent, hasAttemptedLoad, currentSubtopicId]);

  // Add title to document
  useEffect(() => {
    if (detailContent) {
      document.title = `${detailContent.title} | Business Roadmap Generator`;
    }
    return () => {
      document.title = "Business Roadmap Generator";
    };
  }, [detailContent]);

  if (isLoading) {
    return <LoadingOverlay isVisible={true} message="Generating detailed content..." />;
  }
  
  if (error && hasAttemptedLoad) {
    return (
      <Layout>
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <Link 
              href="/roadmap" 
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Roadmap</span>
            </Link>
          </div>
          
          <div className="bg-white shadow-lg rounded-xl p-8 md:p-10 border border-gray-100 text-center">
            <AlertTriangle className="w-16 h-16 mx-auto text-amber-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Content Generation Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <p className="text-gray-500 mb-8">This might be due to API rate limits or service disruption.</p>
            <Link
              href="/roadmap"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Return to Roadmap
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!detailContent) {
    return <LoadingOverlay isVisible={true} message="Preparing content..." />;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link 
            href="/roadmap" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Roadmap</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <button 
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: detailContent.title,
                    text: `Check out this detailed guide on ${detailContent.title}`,
                    url: window.location.href
                  }).catch((error) => console.log('Error sharing', error));
                }
              }}
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
            
            <button 
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={handlePrint}
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            
            <button 
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => {
                // Would connect to a bookmark feature in a real app
                alert("Bookmarked for later reference");
              }}
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        </div>
        
        <motion.div 
          className="bg-white shadow-lg rounded-xl p-8 md:p-10 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-8 border-b border-gray-100 pb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                {detailContent.section}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <FileText className="w-3 h-3 mr-1" />
                Detailed Guide
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{detailContent.title}</h1>
            <p className="text-gray-600">
              A comprehensive guide for implementing this aspect of your business plan. 
              Follow these detailed steps, best practices, and expert recommendations.
            </p>
          </div>
          
          <div className="prose prose-blue lg:prose-lg max-w-none">
            <ReactMarkdown>{detailContent.content}</ReactMarkdown>
          </div>
          
          <div className="mt-10 pt-8 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Was this guide helpful?</h3>
                <p className="text-gray-600 text-sm">
                  Find more detailed guides for each aspect of your business roadmap.
                </p>
              </div>
              <Link 
                href="/roadmap" 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <span>Return to Roadmap</span>
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default DetailPage;
