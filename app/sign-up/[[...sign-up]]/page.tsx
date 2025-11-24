import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  // Check if Clerk is configured
  const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!hasClerk) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div>
            <h2 className="text-center text-3xl font-bold text-gray-900">
              Sign Up (Development Mode)
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Clerk not configured - mock authentication active
            </p>
          </div>
          <form className="mt-8 space-y-6" action="/checkout">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-nursing-blue focus:border-nursing-blue sm:text-sm"
                  placeholder="First name"
                  defaultValue="Jane"
                />
              </div>
              <div>
                <input
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-nursing-blue focus:border-nursing-blue sm:text-sm"
                  placeholder="Last name"
                  defaultValue="Doe"
                />
              </div>
              <div>
                <input
                  type="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-nursing-blue focus:border-nursing-blue sm:text-sm"
                  placeholder="Email address"
                  defaultValue="student@example.com"
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-nursing-blue focus:border-nursing-blue sm:text-sm"
                  placeholder="Password"
                  defaultValue="password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-nursing-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nursing-blue"
              >
                Create Account (Mock)
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <SignUp
        fallbackRedirectUrl="/checkout"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg",
          },
        }}
      />
    </div>
  );
}

