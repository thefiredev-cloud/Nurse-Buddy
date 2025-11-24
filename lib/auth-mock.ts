// Mock authentication utilities for development without Clerk
export const mockUser = {
  id: "user_mock_123",
  email: "student@example.com",
  firstName: "Jane",
  lastName: "Doe",
  fullName: "Jane Doe",
  imageUrl: "/placeholder-avatar.png",
};

export function getMockAuth() {
  return {
    userId: mockUser.id,
    user: mockUser,
  };
}

export function requireAuth() {
  // In development, always return mock user
  if (process.env.NODE_ENV === "development" && !process.env.CLERK_SECRET_KEY) {
    return getMockAuth();
  }
  
  // In production with Clerk, this would check real auth
  return null;
}

