import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, MapPin, Clock, CreditCard, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchUserReservations } from '../services/reservationService';
import { Reservation } from '../types';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const loadReservations = async () => {
      try {
        if (user) {
          const data = await fetchUserReservations(user.id);
          setReservations(data);
        }
      } catch (err) {
        setError('Failed to load your reservations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  // Filter reservations based on active tab
  const currentDate = new Date();
  const upcomingReservations = reservations.filter(
    (res) => new Date(res.departureDate) >= currentDate
  );
  const pastReservations = reservations.filter(
    (res) => new Date(res.departureDate) < currentDate
  );

  const displayReservations = activeTab === 'upcoming' ? upcomingReservations : pastReservations;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* User Info Card */}
          <div className="bg-white shadow-md rounded-lg p-6 md:col-span-1 h-fit">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-3xl font-bold mb-4">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {user.role === 'admin' ? 'Admin User' : 'Regular User'}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={handleLogout}
                className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Sign Out
              </button>
              
              {user.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="w-full mt-3 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                >
                  Go to Admin Dashboard
                </button>
              )}
            </div>
          </div>
          
          {/* Reservations */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden md:col-span-2">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`relative min-w-0 flex-1 overflow-hidden py-4 px-4 text-center text-sm font-medium ${
                    activeTab === 'upcoming'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Upcoming Reservations
                  {upcomingReservations.length > 0 && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {upcomingReservations.length}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab('past')}
                  className={`relative min-w-0 flex-1 overflow-hidden py-4 px-4 text-center text-sm font-medium ${
                    activeTab === 'past'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Past Trips
                  {pastReservations.length > 0 && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {pastReservations.length}
                    </span>
                  )}
                </button>
              </nav>
            </div>
            
            <div className="p-4">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
                  {error}
                </div>
              ) : displayReservations.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                    <Calendar size={24} className="text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {activeTab === 'upcoming' 
                      ? 'No upcoming reservations' 
                      : 'No past trips'}
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {activeTab === 'upcoming' 
                      ? 'You have no upcoming bus reservations. Book a new trip now!'
                      : 'You have no past trip records.'}
                  </p>
                  {activeTab === 'upcoming' && (
                    <button
                      onClick={() => navigate('/')}
                      className="mt-6 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Find a Bus
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {displayReservations.map((reservation) => (
                    <div 
                      key={reservation.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:border-primary-300 hover:shadow-md transition-all"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-bold text-gray-900">{reservation.busName}</h3>
                          <div className="text-lg font-bold text-primary-600">
                            ${reservation.totalFare}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-start">
                            <MapPin size={16} className="text-gray-500 mt-0.5 mr-2" />
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Route</div>
                              <div className="font-medium">{reservation.route}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <Calendar size={16} className="text-gray-500 mt-0.5 mr-2" />
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Date</div>
                              <div className="font-medium">{formatDate(reservation.departureDate)}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <Clock size={16} className="text-gray-500 mt-0.5 mr-2" />
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Departure</div>
                              <div className="font-medium">{reservation.departureTime}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <User size={16} className="text-gray-500 mt-0.5 mr-2" />
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Seats</div>
                              <div className="font-medium">{reservation.numSeats}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                          <div className="flex items-center">
                            <CreditCard size={16} className="text-gray-500 mr-2" />
                            <span className="text-sm text-gray-500">
                              Payment Status:
                              <span className="ml-1 text-green-600 font-medium">Confirmed</span>
                            </span>
                          </div>
                          
                          {activeTab === 'upcoming' && (
                            <button
                              onClick={() => {/* View details or print ticket */}}
                              className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
                            >
                              View Ticket
                              <ChevronRight size={16} className="ml-1" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;