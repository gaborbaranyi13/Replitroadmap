import React from "react";
import Layout from "@/components/Layout";
import SearchBar from "@/components/SearchBar";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  LayoutGrid, 
  Sparkles, 
  FileText, 
  ArrowRight,
  CheckCircle,
  Target,
  TrendingUp
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
        <div className="bg-gradient-to-br from-primary to-secondary text-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute right-0 bottom-0 w-1/2 h-1/2 bg-white/10 rounded-tl-full"></div>
            <div className="absolute left-0 top-0 w-1/3 h-1/3 bg-white/10 rounded-br-full"></div>
          </div>
          
          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="text-center mb-12">
              <motion.h1 
                className="text-4xl sm:text-6xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Turn Your Business Idea Into a 
                <span className="relative inline-block mx-2">
                  <span className="relative z-10">Strategic Roadmap</span>
                  <span className="absolute bottom-2 left-0 right-0 h-3 bg-white/20 -z-10 rounded"></span>
                </span>
              </motion.h1>
              <motion.p 
                className="text-xl text-white/90 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Get an AI-powered, step-by-step guide to build and scale your business 
                with actionable insights and expert recommendations.
              </motion.p>
            </div>

            <SearchBar />
          </div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl border border-gray-100 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6">
                <LayoutGrid className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Structured Framework</h3>
              <p className="text-gray-600">Get a comprehensive 10-section roadmap with 5 key subtopics in each section, covering all aspects of your business journey.</p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl border border-gray-100 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="w-14 h-14 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary mb-6">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Insights</h3>
              <p className="text-gray-600">Leverage Gemini's advanced AI to generate tailored, actionable strategies and insights specific to your business idea.</p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl border border-gray-100 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <div className="w-14 h-14 rounded-lg bg-green-100 flex items-center justify-center text-green-600 mb-6">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Detailed Guides</h3>
              <p className="text-gray-600">Dive deep into each subtopic with comprehensive guides including best practices, pitfalls to avoid, and industry-specific advice.</p>
            </motion.div>
          </div>

          <motion.div 
            className="relative overflow-hidden rounded-2xl shadow-xl mb-20 bg-gradient-to-br from-gray-900 to-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="absolute inset-0 opacity-40 mix-blend-overlay">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800&q=80" 
                alt="Business strategy meeting" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="relative z-10 py-16 px-8 sm:px-16 lg:px-24 flex items-center min-h-[400px]">
              <div className="text-white max-w-2xl">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">Strategic Planning Made Simple</h2>
                <p className="text-xl opacity-90 mb-8">Our AI-powered roadmap generator helps entrepreneurs, startups, and business owners create comprehensive business plans in minutes, not weeks.</p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary-foreground shrink-0 mt-0.5" />
                    <span>Save weeks of research and planning time</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary-foreground shrink-0 mt-0.5" />
                    <span>Get industry-specific strategies and insights</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary-foreground shrink-0 mt-0.5" />
                    <span>Instantly generate a comprehensive roadmap for any business idea</span>
                  </li>
                </ul>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-md"
                >
                  Try It Now
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>

          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Three simple steps to create your comprehensive business roadmap</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <motion.div 
                className="flex flex-col items-center text-center relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-md">
                  <span className="text-3xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Enter Your Idea</h3>
                <p className="text-gray-600">Type your business concept into the search bar at the top of the page.</p>
                
                {/* Only show the arrow on desktop */}
                <div className="hidden md:block absolute right-0 top-10 translate-x-1/2">
                  <ArrowRight className="w-8 h-8 text-gray-300" />
                </div>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center text-center relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-md">
                  <span className="text-3xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Generate Roadmap</h3>
                <p className="text-gray-600">Our AI analyzes your idea and creates a structured, comprehensive business roadmap.</p>
                
                {/* Only show the arrow on desktop */}
                <div className="hidden md:block absolute right-0 top-10 translate-x-1/2">
                  <ArrowRight className="w-8 h-8 text-gray-300" />
                </div>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-md">
                  <span className="text-3xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Explore & Implement</h3>
                <p className="text-gray-600">Dive into the detailed sections and subtopics to start building your business.</p>
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <motion.div 
              className="bg-gray-50 rounded-2xl p-8 border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-3">For Startups</h3>
              <p className="text-gray-600 mb-6">Get a complete roadmap for your new business venture, from market research to scaling strategies.</p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <span>Validate your business idea</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <span>Define your target market</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <span>Create a funding strategy</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="bg-gray-50 rounded-2xl p-8 border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-3">For Small Businesses</h3>
              <p className="text-gray-600 mb-6">Optimize operations and growth strategies to take your existing business to the next level.</p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-1" />
                  <span>Streamline operations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-1" />
                  <span>Expand your customer base</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-1" />
                  <span>Improve profit margins</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="bg-gray-50 rounded-2xl p-8 border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600 mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-3">For Entrepreneurs</h3>
              <p className="text-gray-600 mb-6">Transform your creative ideas into viable business models with a structured action plan.</p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-1" />
                  <span>Evaluate business opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-1" />
                  <span>Create a competitive advantage</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-1" />
                  <span>Develop a marketing strategy</span>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.div 
            className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 sm:p-12 shadow-xl border border-gray-200"
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
                  className="inline-flex items-center gap-2 px-7 py-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-md"
                >
                  Generate Your Roadmap
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur"></div>
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
                    alt="Startup planning session" 
                    className="w-full h-auto rounded-xl shadow-lg border border-white" 
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </Layout>
  );
};

export default Home;
