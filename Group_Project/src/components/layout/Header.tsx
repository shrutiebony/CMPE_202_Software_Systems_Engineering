import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, ChevronDown, User, LogOut, Settings, UtensilsCrossed } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types/auth';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <UtensilsCrossed className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">BookTable</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/search" className="text-gray-700 hover:text-primary-600 transition-colors">
              Find a Table
            </Link>
            
            {isAuthenticated && user?.role === UserRole.RESTAURANT_MANAGER && (
              <Link to="/restaurant-dashboard" className="text-gray-700 hover:text-primary-600 transition-colors">
                Restaurant Dashboard
              </Link>
            )}
            
            {isAuthenticated && user?.role === UserRole.ADMIN && (
              <>
                <Link to="/admin" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Dashboard
                </Link>
                <Link to="/admin/restaurants" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Restaurants
                </Link>
              </>
            )}
          </div>
          
          {/* Auth/Profile Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button 
                  onClick={toggleProfile} 
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-5 w-5 text-primary-600" />
                    )}
                  </div>
                  <span className="hidden md:inline">{user.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 animate-scale-in">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    
                    {user.role === UserRole.CUSTOMER && (
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>My Profile</span>
                        </div>
                      </Link>
                    )}
                    
                    {user.role === UserRole.RESTAURANT_MANAGER && (
                      <Link 
                        to="/restaurant-settings" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <Settings className="h-4 w-4" />
                          <span>Restaurant Settings</span>
                        </div>
                      </Link>
                    )}
                    
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center space-x-2">
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link 
                  to="/login" 
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-gray-700 focus:outline-none" 
              onClick={toggleMenu}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-3 border-t border-gray-100 animate-fade-in">
            <Link 
              to="/search" 
              className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Find a Table
            </Link>
            
            {isAuthenticated && user?.role === UserRole.RESTAURANT_MANAGER && (
              <Link 
                to="/restaurant-dashboard" 
                className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Restaurant Dashboard
              </Link>
            )}
            
            {isAuthenticated && user?.role === UserRole.ADMIN && (
              <>
                <Link 
                  to="/admin" 
                  className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/admin/restaurants" 
                  className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Restaurants
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;