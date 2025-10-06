import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { fetchBuses } from '../services/busService';
import BusCard from '../components/bus/BusCard';
import HeroSection from '../components/home/HeroSection';
import { Bus } from '../types';

const HomePage = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [filteredBuses, setFilteredBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  // Search state
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    const loadBuses = async () => {
      try {
        const data = await fetchBuses();
        setBuses(data);
        setFilteredBuses(data);
      } catch (err) {
        setError('Failed to load buses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadBuses();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter buses based on search criteria
    const filtered = buses.filter(bus => {
      const matchesFrom = !from || bus.from.toLowerCase().includes(from.toLowerCase());
      const matchesTo = !to || bus.to.toLowerCase().includes(to.toLowerCase());
      const matchesDate = !date || bus.departureDate === date;
      
      return matchesFrom && matchesTo && matchesDate;
    });
    
    setFilteredBuses(filtered);
  };

  return (
    <div>
      <HeroSection />
      
      {/* Search Section */}
      <div className="bg-white shadow-md rounded-lg -mt-8 relative z-10 max-w-6xl mx-auto">
        <form onSubmit={handleSearch} className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
                From
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="from"
                  type="text"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="Departure city"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="to"
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="Arrival city"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Departure Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
              >
                <Search size={18} className="mr-2" />
                Search Buses
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Bus Listings */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Available Buses</h2>
          
          {user?.role === 'admin' && (
            <Link
              to="/admin/bus/new"
              className="inline-flex items-center px-4 py-2 bg-secondary-500 text-white rounded-md hover:bg-secondary-600 transition-colors"
            >
              Add New Bus
            </Link>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
            {error}
          </div>
        ) : filteredBuses.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-6 rounded-md text-center">
            <p className="text-lg font-medium mb-2">No buses found</p>
            <p>Try adjusting your search criteria or check back later for more options.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBuses.map((bus) => (
              <BusCard key={bus.id} bus={bus} />
            ))}
          </div>
        )}
      </div>
      
      {/* Popular Routes Section */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Popular Routes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularRoutes.map((route, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-40 bg-gray-200 relative">
                  <img 
                    src={route.image} 
                    alt={`${route.from} to ${route.to}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <div className="font-bold text-lg">{route.from} to {route.to}</div>
                      <div className="text-sm opacity-90">Starting from ${route.price}</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock size={16} className="mr-1" />
                      <span>{route.duration}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {route.frequency}
                    </div>
                  </div>
                  
                  <button
                    className="w-full mt-2 flex items-center justify-center py-2 px-4 border border-primary-600 text-primary-600 rounded-md hover:bg-primary-50 transition-colors"
                    onClick={() => {
                      setFrom(route.from);
                      setTo(route.to);
                      // Scroll to search section
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    View Schedule
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sample popular routes data
const popularRoutes = [
  {
    from: 'New York',
    to: 'Boston',
    price: 45,
    duration: '4h 30m',
    frequency: 'Daily',
    image: 'https://images.pexels.com/photos/2129796/pexels-photo-2129796.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    from: 'Los Angeles',
    to: 'San Francisco',
    price: 55,
    duration: '6h 15m',
    frequency: 'Daily',
    image: 'https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    from: 'Chicago',
    to: 'Detroit',
    price: 35,
    duration: '5h 45m',
    frequency: 'Weekdays',
    image: 'https://images.pexels.com/photos/2846217/pexels-photo-2846217.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];

export default HomePage;