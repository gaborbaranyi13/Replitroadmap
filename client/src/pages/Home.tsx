import React from "react";
import Layout from "@/components/Layout";
import SearchBar from "@/components/SearchBar";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  LayoutGrid, 
  Sparkles, 
  FileText, 
  ArrowRight
} from "lucide-react";

const Home: React.FC = () => {
  const [, setLocation] = useLocation();

  return (
    <Layout>
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">Turn Your Business Idea Into a Strategic Roadmap</h1>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">Get an AI-powered, step-by-step guide to build and scale your business with actionable insights and expert recommendations.</p>
            </div>

            <SearchBar />
          </div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 mb-4">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Structured Framework</h3>
              <p className="text-gray-600">Get a comprehensive 10-section roadmap with 5 key subtopics in each section, covering all aspects of your business journey.</p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-12 h-12 rounded-lg bg-secondary-100 flex items-center justify-center text-secondary-600 mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
              <p className="text-gray-600">Leverage Gemini's advanced AI to generate tailored, actionable strategies and insights specific to your business idea.</p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600 mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Guides</h3>
              <p className="text-gray-600">Dive deep into each subtopic with comprehensive guides including best practices, pitfalls to avoid, and industry-specific advice.</p>
            </motion.div>
          </div>

          <motion.div 
            className="relative overflow-hidden rounded-2xl shadow-xl mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800&q=80" 
              alt="Business strategy meeting" 
              className="w-full h-auto object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/20 flex items-center">
              <div className="text-white px-8 sm:px-12 max-w-2xl">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Strategic Planning Made Simple</h2>
                <p className="text-lg sm:text-xl opacity-90 mb-6">Our AI-powered roadmap generator helps entrepreneurs, startups, and business owners create comprehensive business plans in minutes, not weeks.</p>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Learn More
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>

          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Three simple steps to create your comprehensive business roadmap</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mb-6">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Enter Your Idea</h3>
                <p className="text-gray-600">Type your business concept into the search bar at the top of the page.</p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mb-6">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Generate Roadmap</h3>
                <p className="text-gray-600">Our AI analyzes your idea and creates a structured, comprehensive business roadmap.</p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mb-6">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Explore & Implement</h3>
                <p className="text-gray-600">Dive into the detailed sections and subtopics to start building your business.</p>
              </motion.div>
            </div>
          </div>

          <motion.div 
            className="bg-gray-100 rounded-2xl p-8 sm:p-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Ready to Start Your Business Journey?</h2>
                <p className="text-lg text-gray-600 mb-6">Whether you're a first-time entrepreneur or a seasoned business owner, our roadmap generator provides the guidance you need to succeed.</p>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Generate Your Roadmap
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
                  alt="Startup planning session" 
                  className="w-full h-auto rounded-xl shadow-lg" 
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </Layout>
  );
};

export default Home;
