import { Outlet, Link } from 'react-router-dom';
import { Bus } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image/Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-900 text-white items-center justify-center">
        <div className="max-w-md p-8">
          <div className="flex items-center mb-8">
            <Bus size={40} className="text-secondary-500 mr-3" />
            <h1 className="text-3xl font-bold">TravelEase</h1>
          </div>
          <h2 className="text-4xl font-bold mb-6">Welcome to your journey management platform</h2>
          <p className="text-lg opacity-80">
            Book buses, manage reservations, and travel with ease. The smartest way to plan your journey.
          </p>
        </div>
      </div>
      
      {/* Right side - Auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center mb-8 lg:hidden">
            <Bus size={32} className="text-primary-600 mr-2" />
            <h1 className="text-2xl font-bold text-primary-900">TravelEase</h1>
          </div>
          
          <Outlet />
          
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>© 2025 TravelEase. All rights reserved.</p>
            <p className="mt-2">
              <Link to="/" className="text-primary-600 hover:text-primary-700">
                Return to home page
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;