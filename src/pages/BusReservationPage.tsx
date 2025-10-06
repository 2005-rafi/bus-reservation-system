import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Bus as BusIcon, Calendar, Clock, MapPin, Users, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchBusById } from '../services/busService';
import { createReservation } from '../services/reservationService';
import { Bus } from '../types';

const BusReservationPage = () => {
  const [bus, setBus] = useState<Bus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1 = passenger details, 2 = payment
  const { busId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [numSeats, setNumSeats] = useState(1);
  const [passengers, setPassengers] = useState([{ name: '', age: '' }]);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadBus = async () => {
      try {
        if (busId) {
          const data = await fetchBusById(busId);
          setBus(data);
        }
      } catch (err) {
        setError('Failed to load bus details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadBus();
  }, [busId]);

  const handlePassengerChange = (index: number, field: 'name' | 'age', value: string) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengers(updatedPassengers);
  };

  const handleNumSeatsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(e.target.value);
    setNumSeats(count);
    
    // Update passengers array based on number of seats
    if (count > passengers.length) {
      // Add more passenger entries
      const newPassengers = [...passengers];
      for (let i = passengers.length; i < count; i++) {
        newPassengers.push({ name: '', age: '' });
      }
      setPassengers(newPassengers);
    } else if (count < passengers.length) {
      // Remove excess passenger entries
      setPassengers(passengers.slice(0, count));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validate passenger details
    const isValid = passengers.every(p => p.name.trim() !== '' && p.age.trim() !== '');
    if (!isValid) {
      setFormError('Please provide name and age for all passengers.');
      return;
    }

    if (step === 1) {
      // Move to payment step
      setStep(2);
      window.scrollTo(0, 0);
    } else {
      // Submit reservation
      setSubmitting(true);
      
      try {
        if (!bus || !busId) throw new Error('Bus information is missing');
        
        await createReservation({
          busId,
          userId: user?.id || '',
          passengerDetails: passengers,
          numSeats,
          totalFare: bus.fare * numSeats,
          contactInfo: { name, email, phone }
        });
        
        // Navigate to success page or show success message
        navigate('/', { state: { reservationSuccess: true } });
      } catch (err) {
        setFormError('Failed to complete reservation. Please try again.');
        setStep(1);
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !bus) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-lg max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error || 'Bus not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ChevronLeft size={16} className="mr-1" />
            Go back
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to buses
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 1 ? 'Reserve Your Seats' : 'Complete Payment'}
          </h1>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div 
              className="bg-primary-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: step === 1 ? '50%' : '100%' }}
            ></div>
          </div>
        </div>
        
        {/* Bus details summary */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <div className="mr-4">
              <div className="bg-primary-100 p-3 rounded-full">
                <BusIcon size={24} className="text-primary-600" />
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{bus.name}</h2>
              
              <div className="flex flex-wrap gap-y-4">
                <div className="w-full sm:w-1/2 flex items-center">
                  <Calendar size={16} className="text-gray-500 mr-2" />
                  <span>{formatDate(bus.departureDate)}</span>
                </div>
                
                <div className="w-full sm:w-1/2 flex items-center">
                  <Clock size={16} className="text-gray-500 mr-2" />
                  <span>{bus.departureTime}</span>
                </div>
                
                <div className="w-full flex items-center mt-2">
                  <MapPin size={16} className="text-gray-500 mr-2" />
                  <span className="font-medium">
                    {bus.from} to {bus.to}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-xl font-bold text-primary-600">${bus.fare}</div>
              <div className="text-sm text-gray-500">per seat</div>
            </div>
          </div>
        </div>
        
        {/* Reservation form */}
        {step === 1 ? (
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Passenger Details</h2>
            
            {formError && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
                {formError}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
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
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="numSeats" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Seats
                </label>
                <div className="relative">
                  <select
                    id="numSeats"
                    value={numSeats}
                    onChange={handleNumSeatsChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none"
                  >
                    {[...Array(Math.min(bus.availableSeats, 6))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <Users size={16} className="text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-4">Passenger Information</h3>
            
            {passengers.map((passenger, index) => (
              <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h4 className="font-medium text-gray-700 mb-3">Passenger {index + 1}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label 
                      htmlFor={`passenger-name-${index}`} 
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      id={`passenger-name-${index}`}
                      type="text"
                      value={passenger.name}
                      onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label 
                      htmlFor={`passenger-age-${index}`} 
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Age
                    </label>
                    <input
                      id={`passenger-age-${index}`}
                      type="number"
                      min="0"
                      max="120"
                      value={passenger.age}
                      onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div>
                <div className="text-lg font-medium">Total: ${bus.fare * numSeats}</div>
                <div className="text-sm text-gray-500">{numSeats} seat(s) × ${bus.fare}</div>
              </div>
              
              <button
                type="submit"
                className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
              >
                Continue to Payment
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Information</h2>
            
            {formError && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
                {formError}
              </div>
            )}
            
            <div className="mb-6">
              <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <div className="relative">
                <input
                  id="card-number"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <CreditCard size={20} className="text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  id="expiry"
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  id="cvv"
                  type="text"
                  placeholder="123"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="card-name" className="block text-sm font-medium text-gray-700 mb-1">
                Name on Card
              </label>
              <input
                id="card-name"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Reservation Summary</h3>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Bus:</span>
                <span className="font-medium">{bus.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Route:</span>
                <span className="font-medium">{bus.from} to {bus.to}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{formatDate(bus.departureDate)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Seats:</span>
                <span className="font-medium">{numSeats}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-primary-600">${bus.fare * numSeats}</span>
              </div>
            </div>
            
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Back to Details
              </button>
              
              <button
                type="submit"
                className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                disabled={submitting}
              >
                {submitting ? 'Processing...' : 'Complete Reservation'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BusReservationPage;