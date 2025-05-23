import { Link, useLocation } from "wouter";
import { Building } from "lucide-react";

export default function Header() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white shadow-material sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center mr-3">
                  <Building className="text-white" size={16} />
                </div>
                <span className="text-xl font-bold text-secondary-700">TechCorp</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-secondary-400 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors">Home</a>
            <a href="#" className="text-secondary-400 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors">About</a>
            <a href="#" className="text-secondary-400 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors">Services</a>
            <Link href="/jobs">
              <span className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                isActive("/jobs") || isActive("/") 
                  ? "text-primary-500 border-b-2 border-primary-500" 
                  : "text-secondary-400 hover:text-primary-500"
              }`}>
                Careers
              </span>
            </Link>
            <a href="#" className="text-secondary-400 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors">Contact</a>
            <Link href="/admin">
              <span className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                isActive("/admin") 
                  ? "text-primary-500 border-b-2 border-primary-500" 
                  : "text-secondary-400 hover:text-primary-500"
              }`}>
                Admin
              </span>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button type="button" className="text-secondary-400 hover:text-primary-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
