// This is a mock implementation that simulates backend authentication
// In a real app, these would make actual API calls to your backend

interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
  };
  token: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Mock user data
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'user@example.com',
    password: 'password123',
    role: 'user' as const
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin' as const
  }
];

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Find user with matching credentials
  const user = mockUsers.find(u => u.email === email && u.password === password);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Create a mock JWT token
  const token = `mock-jwt-token-${user.id}-${Date.now()}`;

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  };
};

export const registerUser = async (name: string, email: string, password: string): Promise<LoginResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Check if email is already taken
  if (mockUsers.some(u => u.email === email)) {
    throw new Error('Email is already in use');
  }

  // Create new user
  const newUser = {
    id: `${mockUsers.length + 1}`,
    name,
    email,
    password,
    role: 'user' as const
  };

  // In a real app, you would save this to the database
  mockUsers.push(newUser);

  // Create a mock JWT token
  const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;

  return {
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    },
    token
  };
};

export const getCurrentUser = async (): Promise<LoginResponse['user']> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // In a real app, you would verify the JWT token and get the user
  // For this mock, we'll just return the first user
  const user = mockUsers[0];

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
};