import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, X } from 'lucide-react';
import { fetchBusById, createBus, updateBus } from '../services/busService';
import { Bus } from '../types';

const AdminBusFormPage = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!busId;
  
  // Form state
  const [formData, setFormData] = useState<Partial<Bus>>({
    name: '',
    type: 'Standard',
    from: '',
    to: '',
    departureDate: '',
    departureTime: '',
    fare: 0,
    totalSeats: 40,
    availableSeats: 40,
    features: []
  });
  
  const [newFeature, setNewFeature] = useState('');
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBus = async () => {
      if (isEditMode) {
        try {
          const data = await fetchBusById(busId);
          setFormData(data);
        } catch (err) {
          setError('Failed to load bus details. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };

    loadBus();
  }, [busId, isEditMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value
    });
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && formData.features) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    if (formData.features) {
      const updatedFeatures = [...formData.features];
      updatedFeatures.splice(index, 1);
      setFormData({
        ...formData,
        features: updatedFeatures
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Ensure all required fields are present
      if (!formData.name || !formData.from || !formData.to || !formData.departureDate || !formData.departureTime) {
        throw new Error('Please fill all required fields');
      }

      // Ensure fare is a positive number
      if (formData.fare <= 0) {
        throw new Error('Fare must be greater than zero');
      }

      // Create or update the bus
      if (isEditMode && busId) {
        await updateBus(busId, formData as Bus);
      } else {
        await createBus(formData as Bus);
      }

      // Navigate back to admin dashboard
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to save bus information');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/admin')}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Dashboard
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {isEditMode ? 'Edit Bus Information' : 'Add New Bus'}
        </h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Bus Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Bus Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Standard">Standard</option>
                <option value="Express">Express</option>
                <option value="Luxury">Luxury</option>
                <option value="Sleeper">Sleeper</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
                From (Origin) *
              </label>
              <input
                id="from"
                name="from"
                type="text"
                value={formData.from}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
                To (Destination) *
              </label>
              <input
                id="to"
                name="to"
                type="text"
                value={formData.to}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 mb-1">
                Departure Date *
              </label>
              <input
                id="departureDate"
                name="departureDate"
                type="date"
                value={formData.departureDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="departureTime" className="block text-sm font-medium text-gray-700 mb-1">
                Departure Time *
              </label>
              <input
                id="departureTime"
                name="departureTime"
                type="time"
                value={formData.departureTime}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="fare" className="block text-sm font-medium text-gray-700 mb-1">
                Fare (per seat) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  id="fare"
                  name="fare"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.fare}
                  onChange={handleInputChange}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="totalSeats" className="block text-sm font-medium text-gray-700 mb-1">
                Total Seats *
              </label>
              <input
                id="totalSeats"
                name="totalSeats"
                type="number"
                min="1"
                value={formData.totalSeats}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="availableSeats" className="block text-sm font-medium text-gray-700 mb-1">
                Available Seats *
              </label>
              <input
                id="availableSeats"
                name="availableSeats"
                type="number"
                min="0"
                max={formData.totalSeats}
                value={formData.availableSeats}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              {formData.availableSeats > (formData.totalSeats || 0) && (
                <p className="text-red-500 text-sm mt-1">
                  Available seats cannot exceed total seats.
                </p>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features & Amenities
            </label>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.features && formData.features.map((feature, index) => (
                <div 
                  key={index}
                  className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1"
                >
                  <span className="text-sm text-gray-800">{feature}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature (e.g. WiFi, USB Charging)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 border-l-0 rounded-r-md hover:bg-gray-200"
              >
                <Plus size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Examples: WiFi, USB Charging, AC, Reclining Seats, Snacks, etc.
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : isEditMode ? 'Update Bus' : 'Add Bus'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminBusFormPage;