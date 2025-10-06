export interface Bus {
  id: string;
  name: string;
  type: string;
  from: string;
  to: string;
  departureDate: string;
  departureTime: string;
  fare: number;
  totalSeats: number;
  availableSeats: number;
  features?: string[];
}

export interface Passenger {
  name: string;
  age: string;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
}

export interface Reservation {
  id: string;
  busId: string;
  userId: string;
  busName: string;
  route: string;
  departureDate: string;
  departureTime: string;
  numSeats: number;
  totalFare: number;
  passengerDetails: Passenger[];
  contactInfo: ContactInfo;
}

export interface ReservationInput {
  busId: string;
  userId: string;
  numSeats: number;
  totalFare: number;
  passengerDetails: Passenger[];
  contactInfo: ContactInfo;
}