// This is a mock implementation that simulates backend API calls
// In a real app, these would make actual API calls to your backend

import { Reservation, ReservationInput } from '../types';
import { fetchBusById } from './busService';

// Mock reservation data
let mockReservations: Reservation[] = [
  {
    id: '1',
    busId: '1',
    userId: '1',
    busName: 'Express Voyager',
    route: 'New York to Boston',
    departureDate: '2025-04-20',
    departureTime: '08:30',
    numSeats: 2,
    totalFare: 90,
    passengerDetails: [
      { name: 'John Doe', age: '35' },
      { name: 'Jane Doe', age: '32' }
    ],
    contactInfo: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-123-4567'
    }
  },
  {
    id: '2',
    busId: '2',
    userId: '1',
    busName: 'Coastal Cruiser',
    route: 'Los Angeles to San Francisco',
    departureDate: '2025-04-21',
    departureTime: '10:00',
    numSeats: 1,
    totalFare: 55,
    passengerDetails: [
      { name: 'John Doe', age: '35' }
    ],
    contactInfo: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-123-4567'
    }
  }
];

export const fetchReservations = async (): Promise<Reservation[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...mockReservations];
};

export const fetchUserReservations = async (userId: string): Promise<Reservation[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockReservations.filter(r => r.userId === userId);
};

export const createReservation = async (data: ReservationInput): Promise<Reservation> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Get bus details
  const bus = await fetchBusById(data.busId);
  
  // Create new reservation
  const newReservation: Reservation = {
    id: `${mockReservations.length + 1}`,
    busId: data.busId,
    userId: data.userId,
    busName: bus.name,
    route: `${bus.from} to ${bus.to}`,
    departureDate: bus.departureDate,
    departureTime: bus.departureTime,
    numSeats: data.numSeats,
    totalFare: data.totalFare,
    passengerDetails: data.passengerDetails,
    contactInfo: data.contactInfo
  };
  
  // Update available seats on the bus (in a real app, this would be a transaction)
  bus.availableSeats -= data.numSeats;
  
  // Save the reservation
  mockReservations.push(newReservation);
  
  return { ...newReservation };
};