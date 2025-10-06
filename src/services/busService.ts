// This is a mock implementation that simulates backend API calls
// In a real app, these would make actual API calls to your backend

import { Bus } from '../types';

// Mock bus data
let mockBuses: Bus[] = [
  {
    id: '1',
    name: 'Express Voyager',
    type: 'Express',
    from: 'New York',
    to: 'Boston',
    departureDate: '2025-04-20',
    departureTime: '08:30',
    fare: 45,
    totalSeats: 40,
    availableSeats: 12,
    features: ['WiFi', 'USB Charging', 'AC']
  },
  {
    id: '2',
    name: 'Coastal Cruiser',
    type: 'Luxury',
    from: 'Los Angeles',
    to: 'San Francisco',
    departureDate: '2025-04-21',
    departureTime: '10:00',
    fare: 55,
    totalSeats: 36,
    availableSeats: 8,
    features: ['WiFi', 'USB Charging', 'AC', 'Snacks', 'Reclining Seats']
  },
  {
    id: '3',
    name: 'Midwest Connector',
    type: 'Standard',
    from: 'Chicago',
    to: 'Detroit',
    departureDate: '2025-04-22',
    departureTime: '09:15',
    fare: 35,
    totalSeats: 45,
    availableSeats: 20,
    features: ['AC', 'WiFi']
  }
];

export const fetchBuses = async (): Promise<Bus[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...mockBuses];
};

export const fetchBusById = async (id: string): Promise<Bus> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const bus = mockBuses.find(b => b.id === id);
  
  if (!bus) {
    throw new Error('Bus not found');
  }
  
  return { ...bus };
};

export const createBus = async (busData: Omit<Bus, 'id'>): Promise<Bus> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newBus: Bus = {
    ...busData,
    id: `${mockBuses.length + 1}`
  };
  
  mockBuses.push(newBus);
  
  return { ...newBus };
};

export const updateBus = async (id: string, busData: Partial<Bus>): Promise<Bus> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockBuses.findIndex(b => b.id === id);
  
  if (index === -1) {
    throw new Error('Bus not found');
  }
  
  const updatedBus = {
    ...mockBuses[index],
    ...busData
  };
  
  mockBuses[index] = updatedBus;
  
  return { ...updatedBus };
};

export const deleteBus = async (id: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockBuses.findIndex(b => b.id === id);
  
  if (index === -1) {
    throw new Error('Bus not found');
  }
  
  mockBuses.splice(index, 1);
};