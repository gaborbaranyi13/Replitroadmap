import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Map, Menu, X } from "lucide-react";

const Header: React.FC = () => {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-primary-600 font-semibold">
              <Map className="h-6 w-6" />
              <span>Business Roadmap</span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className={`font-medium ${location === "/" 
                ? "text-primary-600" 
                : "text-gray-700 hover:text-primary-600 transition-colors"}`}
            >
              Home
            </Link>
            <Link 
              href="/roadmap" 
              className={`font-medium ${location === "/roadmap" 
                ? "text-primary-600" 
                : "text-gray-700 hover:text-primary-600 transition-colors"}`}
            >
              Roadmap
            </Link>
            <a 
              href="#about" 
              className="font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              About
            </a>
          </nav>
          <div className="md:hidden">
            <button 
              type="button" 
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 py-3 space-y-1">
            <Link 
              href="/" 
              className={`block py-2 px-3 rounded-md ${location === "/" 
                ? "bg-primary-50 text-primary-600" 
                : "text-gray-700 hover:bg-gray-50 hover:text-primary-600"}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/roadmap" 
              className={`block py-2 px-3 rounded-md ${location === "/roadmap" 
                ? "bg-primary-50 text-primary-600" 
                : "text-gray-700 hover:bg-gray-50 hover:text-primary-600"}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Roadmap
            </Link>
            <a 
              href="#about" 
              className="block py-2 px-3 rounded-md text-gray-700 hover:bg-gray-50 hover:text-primary-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
