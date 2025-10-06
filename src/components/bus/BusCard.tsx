import { Link } from 'react-router-dom';
import { MapPin, Clock, Calendar, Users, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Bus } from '../../types';

interface BusCardProps {
  bus: Bus;
}

const BusCard = ({ bus }: BusCardProps) => {
  const { user } = useAuth();
  
  const formatTime = (time: string) => {
    return time;
  };
  
  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Bus type tag */}
      <div className="relative">
        {bus.type && (
          <div className="absolute top-4 right-4 bg-primary-600 text-white text-xs py-1 px-2 rounded-full">
            {bus.type}
          </div>
        )}
      </div>
      
      <div className="p-6">
        {/* Bus info header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900">{bus.name}</h3>
          <div className="text-xl font-bold text-primary-600">${bus.fare}</div>
        </div>
        
        {/* Route */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col items-start">
            <div className="text-sm text-gray-500 mb-1">From</div>
            <div className="flex items-center">
              <MapPin size={16} className="text-primary-600 mr-1" />
              <span className="font-medium">{bus.from}</span>
            </div>
          </div>
          
          <div className="flex-grow mx-4 border-t border-dashed border-gray-300 relative">
            <ArrowRight size={16} className="text-gray-400 absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white px-1" />
          </div>
          
          <div className="flex flex-col items-end">
            <div className="text-sm text-gray-500 mb-1">To</div>
            <div className="flex items-center">
              <span className="font-medium">{bus.to}</span>
              <MapPin size={16} className="text-primary-600 ml-1" />
            </div>
          </div>
        </div>
        
        {/* Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-start">
            <Clock size={16} className="text-gray-500 mt-0.5 mr-2" />
            <div>
              <div className="text-xs text-gray-500 mb-1">Departure Time</div>
              <div className="font-medium">{formatTime(bus.departureTime)}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <Calendar size={16} className="text-gray-500 mt-0.5 mr-2" />
            <div>
              <div className="text-xs text-gray-500 mb-1">Date</div>
              <div className="font-medium">{formatDate(bus.departureDate)}</div>
            </div>
          </div>
        </div>
        
        {/* Additional info */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Users size={16} className="mr-1" />
          <span>{bus.availableSeats} seats available</span>
          
          {bus.features && bus.features.length > 0 && (
            <div className="ml-4 flex flex-wrap gap-1">
              {bus.features.map((feature, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                  {feature}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex space-x-3">
          <Link
            to={`/reservation/${bus.id}`}
            className={`flex-1 py-2 px-4 rounded-md text-white text-center font-medium ${
              bus.availableSeats > 0 
                ? 'bg-primary-600 hover:bg-primary-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            {...(bus.availableSeats === 0 ? { onClick: (e) => e.preventDefault() } : {})}
          >
            {bus.availableSeats > 0 ? 'Reserve Seats' : 'Sold Out'}
          </Link>
          
          {user?.role === 'admin' && (
            <Link
              to={`/admin/bus/edit/${bus.id}`}
              className="py-2 px-4 border border-primary-600 text-primary-600 rounded-md hover:bg-primary-50 font-medium text-center"
            >
              Edit
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusCard;