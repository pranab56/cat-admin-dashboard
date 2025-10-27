"use client";

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

export default function SettingsPage() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [rsvpReminders, setRsvpReminders] = useState(false);
  const [eventUpdates, setEventUpdates] = useState(false);
  const [promotions, setPromotions] = useState(true);
  const [eventLimit, setEventLimit] = useState('5');
  const [enableAds, setEnableAds] = useState(true);
  const [dashboard, setDashboard] = useState(false);
  const [eventPage, setEventPage] = useState(true);
  const [both, setBoth] = useState(false);

  const handleSaveChanges = () => {
    console.log('Settings saved:', {
      pushNotifications,
      rsvpReminders,
      eventUpdates,
      promotions,
      eventLimit,
      enableAds,
      dashboard,
      eventPage,
      both
    });
    alert('Changes saved successfully!');
  };

  return (
    <div className="">
      <div className="">
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
          {/* Custom Styles for Switch and Checkbox */}
          <style jsx>{`
            /* Switch Styles */
            button[role="switch"][data-state="checked"] {
              background-color: #668CF9 !important;
            }
            
            button[role="switch"][data-state="unchecked"] {
              background-color: #e5e7eb;
            }

            /* Checkbox Styles */
            button[role="checkbox"][data-state="checked"] {
              background-color: #668CF9 !important;
              border-color: #668CF9 !important;
            }

            button[role="checkbox"][data-state="unchecked"] {
              background-color: white;
              border-color: #d1d5db;
            }
          `}</style>

          {/* Notifications Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>

            {/* Push Notifications Toggle */}
            <div className="flex items-start justify-between py-2">
              <div>
                <h3 className="text-base font-normal text-gray-900">Push Notifications</h3>
                <p className="text-sm text-gray-500 mt-0.5">Enable push notifications for your users</p>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={(checked) => setPushNotifications(checked)}
              />
            </div>

            {/* Notification Type Checkboxes */}
            <div className="space-y-3.5 pl-0 pt-2">
              <div className="flex items-center space-x-2.5">
                <Checkbox
                  id="rsvp"
                  checked={rsvpReminders}
                  onCheckedChange={(checked) => setRsvpReminders(checked as boolean)}
                />
                <label
                  htmlFor="rsvp"
                  className="text-sm font-normal text-gray-900 cursor-pointer"
                >
                  RSVP Reminders
                </label>
              </div>

              <div className="flex items-center space-x-2.5">
                <Checkbox
                  id="updates"
                  checked={eventUpdates}
                  onCheckedChange={(checked) => setEventUpdates(checked as boolean)}
                />
                <label
                  htmlFor="updates"
                  className="text-sm font-normal text-gray-900 cursor-pointer"
                >
                  Event Updates
                </label>
              </div>

              <div className="flex items-center space-x-2.5">
                <Checkbox
                  id="promotions"
                  checked={promotions}
                  onCheckedChange={(checked) => setPromotions(checked as boolean)}
                />
                <label
                  htmlFor="promotions"
                  className="text-sm font-normal text-gray-900 cursor-pointer"
                >
                  Promotions
                </label>
              </div>
            </div>
          </div>

          {/* Event Limits Section */}
          <div className="space-y-4 pt-2">
            <h2 className="text-xl font-semibold text-gray-900">Event Limits</h2>

            <div className="flex items-center gap-4 py-2">
              <label htmlFor="eventLimit" className="text-base font-normal text-gray-900">
                Free User Event Limit (per month)
              </label>
              <Input
                id="eventLimit"
                type="text"
                value={eventLimit}
                onChange={(e) => setEventLimit(e.target.value)}
                placeholder="e.g. 5"
                className="w-72 bg-blue-50 border-blue-100 focus:border-blue-300 focus:ring-blue-200 text-gray-500"
              />
            </div>
          </div>

          {/* Ads Settings Section */}
          <div className="space-y-6 pt-2">
            <h2 className="text-xl font-semibold text-gray-900">Ads Settings</h2>

            {/* Enable Ads Toggle */}
            <div className="flex items-start justify-between py-2">
              <div>
                <h3 className="text-base font-normal text-gray-900">Enable Ads</h3>
                <p className="text-sm text-gray-500 mt-0.5">Enable ads for free users</p>
              </div>
              <Switch
                checked={enableAds}
                onCheckedChange={setEnableAds}
              />
            </div>

            {/* Ad Placement Checkboxes */}
            <div className="space-y-3.5 pl-0 pt-2">
              <div className="flex items-center space-x-2.5">
                <Checkbox
                  id="dashboard"
                  checked={dashboard}
                  onCheckedChange={(checked) => setDashboard(checked as boolean)}
                />
                <label
                  htmlFor="dashboard"
                  className="text-sm font-normal text-gray-900 cursor-pointer"
                >
                  Dashboard
                </label>
              </div>

              <div className="flex items-center space-x-2.5">
                <Checkbox
                  id="eventPage"
                  checked={eventPage}
                  onCheckedChange={(checked) => setEventPage(checked as boolean)}
                />
                <label
                  htmlFor="eventPage"
                  className="text-sm font-normal text-gray-900 cursor-pointer"
                >
                  Event Page
                </label>
              </div>

              <div className="flex items-center space-x-2.5">
                <Checkbox
                  id="both"
                  checked={both}
                  onCheckedChange={(checked) => setBoth(checked as boolean)}
                />
                <label
                  htmlFor="both"
                  className="text-sm font-normal text-gray-900 cursor-pointer"
                >
                  Both
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6">
            <Button
              onClick={handleSaveChanges}
              style={{ backgroundColor: '#668CF9' }}
              className="hover:opacity-90 text-white px-8 py-2.5 rounded-lg font-normal shadow-sm hover:shadow-md transition-all duration-200"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}