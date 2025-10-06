import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to log in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-slide-up">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Sign in to your account</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
              Forgot password?
            </a>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full flex justify-center items-center bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span>Signing in...</span>
          ) : (
            <>
              <LogIn size={18} className="mr-2" />
              Sign in
            </>
          )}
        </button>
      </form>
      
      <p className="mt-6 text-center text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
          Sign up
        </Link>
      </p>
      
      {/* Demo accounts */}
      <div className="mt-8 border-t border-gray-200 pt-6">
        <p className="text-sm text-gray-600 mb-3 font-medium">Demo accounts:</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setEmail('user@example.com');
              setPassword('password123');
            }}
            className="text-xs px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            User Account
          </button>
          <button
            onClick={() => {
              setEmail('admin@example.com');
              setPassword('admin123');
            }}
            className="text-xs px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Admin Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;