import React, { ReactNode } from "react";
import Header from "@/components/Header";
import { 
  LightbulbIcon, 
  Twitter, 
  Linkedin, 
  Github, 
  MessageCircle, 
  Mail, 
  HeartHandshake 
} from "lucide-react";
import { Link } from "wouter";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12">
            <div className="col-span-1 md:col-span-5">
              <div className="flex items-center gap-2 text-primary font-semibold mb-5">
                <LightbulbIcon className="w-6 h-6" />
                <span className="text-lg">Business Roadmap</span>
              </div>
              <p className="text-gray-600 mb-6 max-w-md">
                Transform your business idea into a strategic action plan with our AI-powered roadmap generator. 
                Get detailed guidance for every step of your business journey.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">Product</h3>
              <ul className="space-y-3">
                <li><Link href="/" className="text-gray-600 hover:text-primary transition-colors inline-block">Home</Link></li>
                <li><Link href="/roadmap" className="text-gray-600 hover:text-primary transition-colors inline-block">Roadmap</Link></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Guides</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Examples</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div className="col-span-1 md:col-span-3">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">Get in Touch</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <a href="mailto:contact@businessroadmap.ai" className="text-gray-600 hover:text-primary transition-colors">
                    contact@businessroadmap.ai
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-gray-400" />
                  <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                    Live chat support
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-gray-400" />
                  <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                    Partnership inquiries
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm">
            <p className="text-gray-500">
              &copy; {new Date().getFullYear()} Business Roadmap Generator. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
