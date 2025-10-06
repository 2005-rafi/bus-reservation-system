import { Link } from 'react-router-dom';
import { Bus, Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <Bus className="h-6 w-6 text-secondary-500 mr-2" />
              <span className="text-xl font-bold text-white">TravelEase</span>
            </Link>
            <p className="mb-4 text-sm">
              Making bus travel simple, convenient, and enjoyable since 2025.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">Create Account</Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors">Bus Bookings</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">City to City Travel</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Group Tours</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Corporate Services</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail size={18} className="mr-2 mt-0.5 text-gray-400" />
                <span>support@travelease.com</span>
              </li>
              <li className="flex items-start">
                <Phone size={18} className="mr-2 mt-0.5 text-gray-400" />
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} TravelEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;