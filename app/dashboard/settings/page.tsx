"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";

interface UserSettings {
  name: string;
  email: string;
  preferences: {
    timer_enabled: boolean;
    show_rationales_immediately: boolean;
  };
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    name: "",
    email: "",
    preferences: {
      timer_enabled: true,
      show_rationales_immediately: true,
    },
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/user/settings");
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);

    try {
      const response = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: settings.name,
          preferences: settings.preferences,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-nursing-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nursing-blue focus:border-nursing-blue"
              style={{ backgroundColor: '#ffffff', color: '#111827' }}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={settings.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed here. Please contact support if you need to update your email.
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {success && <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />}
                Save Changes
              </>
            )}
          </Button>
          {success && (
            <p className="text-sm text-green-600">Settings saved successfully!</p>
          )}
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>
            Manage your Nurse Buddy Pro subscription
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-nursing-light rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Pro Access</p>
              <p className="text-sm text-gray-600">$35/month - Active</p>
            </div>
            <Button variant="outline" disabled>
              Manage
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Subscription management coming soon. Contact support for changes.
          </p>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Test Preferences</CardTitle>
          <CardDescription>
            Customize your testing experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Enable Timer</p>
              <p className="text-sm text-gray-600">
                Show 6-hour countdown during tests
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.preferences.timer_enabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  preferences: {
                    ...settings.preferences,
                    timer_enabled: e.target.checked,
                  },
                })
              }
              className="h-5 w-5 text-nursing-blue rounded focus:ring-nursing-blue"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Show Rationales Immediately</p>
              <p className="text-sm text-gray-600">
                Display explanations right after answering
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.preferences.show_rationales_immediately}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  preferences: {
                    ...settings.preferences,
                    show_rationales_immediately: e.target.checked,
                  },
                })
              }
              className="h-5 w-5 text-nursing-blue rounded focus:ring-nursing-blue"
            />
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {success && <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />}
                Save Preferences
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

