import { Building, Linkedin, Twitter, Github, Mail, Phone, MapPin } from "lucide-react";
import logoImage from "@assets/New Direct Mortgage.png";

export default function Footer() {
  return (
    <footer className="bg-secondary-700 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <img 
                src={logoImage} 
                alt="New Direct Mortgage" 
                className="h-8 w-auto filter brightness-0 invert"
              />
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Your trusted partner in mortgage lending with innovative solutions and exceptional service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">Our Team</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">News</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">Investors</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">Web Development</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">Mobile Apps</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">Cloud Solutions</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">Consulting</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>careers@techcorp.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-1" />
                <span>123 Tech Street<br />San Francisco, CA 94105</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-500 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-300">
            © 2024 TechCorp. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-300 hover:text-primary-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-300 hover:text-primary-400 transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-gray-300 hover:text-primary-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
