import { Link } from 'react-router-dom';
import { UtensilsCrossed, Instagram, Twitter, Facebook, Mail, Phone } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <UtensilsCrossed className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-white">BookTable</span>
            </div>
            <p className="text-sm mb-4">
              Find and book the best restaurants in your area. BookTable helps you discover great dining experiences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* For Diners */}
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-4">For Diners</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/search" className="text-gray-400 hover:text-white transition-colors">
                  Find Restaurants
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Mobile App
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Help
                </a>
              </li>
            </ul>
          </div>
          
          {/* For Restaurants */}
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-4">For Restaurants</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Add Your Restaurant
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Restaurant Login
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Business Support
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Success Stories
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                <a href="mailto:support@booktable.com" className="text-gray-400 hover:text-white transition-colors">
                  support@booktable.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                <a href="tel:+1-555-123-4567" className="text-gray-400 hover:text-white transition-colors">
                  +1-555-123-4567
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} BookTable Inc. All rights reserved.
          </p>
          <div className="mt-2 flex justify-center space-x-6">
            <a href="#" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;