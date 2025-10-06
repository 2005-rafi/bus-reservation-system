import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, Menu, X, User, LogOut, Home, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Bus className="h-7 w-7 text-primary-600" />
          <span className="text-xl font-bold text-primary-900">TravelEase</span>
        </Link>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium">
            Home
          </Link>
          
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-gray-700 hover:text-primary-600 font-medium">
              Admin Panel
            </Link>
          )}

          {user ? (
            <div className="relative">
              <button 
                onClick={toggleProfileMenu}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 focus:outline-none"
              >
                <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{user.name}</span>
              </button>

              {/* Profile dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 animate-fade-in">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <User size={16} className="mr-2" />
                    Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="px-4 py-2 rounded text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign in
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700 font-medium"
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home size={18} className="mr-3" />
              Home
            </Link>

            {user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings size={18} className="mr-3" />
                Admin Panel
              </Link>
            )}

            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} className="mr-3" />
                  Profile
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md w-full text-left"
                >
                  <LogOut size={18} className="mr-3" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-center rounded border border-primary-600 text-primary-600 hover:bg-primary-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 text-center rounded bg-primary-600 text-white hover:bg-primary-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;