import React, { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useRoadmap } from "@/contexts/RoadmapContext";
import Layout from "@/components/Layout";
import LoadingOverlay from "@/components/LoadingOverlay";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";

const DetailPage: React.FC = () => {
  const [match, params] = useRoute("/detail/:subtopicId");
  const { roadmapData, detailContent, isLoading, getDetailContent } = useRoadmap();
  
  useEffect(() => {
    if (match && params?.subtopicId && roadmapData) {
      getDetailContent(params.subtopicId);
    }
  }, [match, params?.subtopicId, roadmapData, getDetailContent]);

  if (isLoading || !detailContent) {
    return <LoadingOverlay isVisible={true} message="Generating detailed content..." />;
  }

  return (
    <Layout>
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link href="/roadmap" className="inline-flex items-center gap-1 text-gray-600 hover:text-primary-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Roadmap</span>
          </Link>
        </div>
        
        <motion.div 
          className="bg-white shadow-card rounded-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
              {detailContent.section}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold mt-4">{detailContent.title}</h1>
          </div>
          
          <div className="prose prose-blue max-w-none">
            <ReactMarkdown>{detailContent.content}</ReactMarkdown>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default DetailPage;
