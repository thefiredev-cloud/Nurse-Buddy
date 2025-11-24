import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-nursing-light rounded-full flex items-center justify-center">
              <FileQuestion className="w-10 h-10 text-nursing-blue" />
            </div>
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
          <CardDescription>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-nursing-light p-4 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Looking for something specific?</strong>
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Practice Tests</li>
              <li>• Performance Analytics</li>
              <li>• Account Settings</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Link href="/dashboard">
              <Button className="w-full" size="lg">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full" size="lg">
                Back to Homepage
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

