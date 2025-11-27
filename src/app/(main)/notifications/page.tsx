"use client";

import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner'; // or your preferred toast library
import {
  useDeleteNotificationMutation,
  useGetAllNotificationQuery,
  useReadAllNotificationMutation
} from "../../../features/notifications/notificationsApi";

// Interface based on your API response
interface Notification {
  _id: string;
  message: string;
  role: string;
  type: string;
  status: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: Notification[];
}

const NotificationSystem = () => {
  // API hooks
  const { data: apiResponse, isLoading, error, refetch } = useGetAllNotificationQuery({});
  const [readAllNotification, { isLoading: isReadingAll }] = useReadAllNotificationMutation();
  const [deleteNotification, { isLoading: isDeleting }] = useDeleteNotificationMutation();

  // Handle read all notifications
  const handleReadAll = async (): Promise<void> => {
    try {
      await readAllNotification({}).unwrap();
      toast.success("All notifications marked as read");
      refetch(); // Refresh the notifications list
    } catch (error) {
      console.error('Failed to read all notifications:', error);
      toast.error("Failed to mark all as read");
    }
  };

  // Handle delete notification
  const handleDelete = async (id: string): Promise<void> => {
    try {
      await deleteNotification(id).unwrap();
      toast.success("Notification deleted successfully");
      refetch(); // Refresh the notifications list
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error("Failed to delete notification");
    }
  };

  // Format date to display
  const formatDate = (dateString: string): { date: string; time: string } => {
    const date = new Date(dateString);
    const dateFormatted = date.toLocaleDateString('en-US');
    const timeFormatted = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return { date: dateFormatted, time: timeFormatted };
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <CheckCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <CheckCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  // Get notification background color based on read status
  const getNotificationBgColor = (isRead: boolean) => {
    return isRead ? 'bg-gray-50' : 'bg-blue-50 border border-blue-200';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-gray-600">Loading notifications...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load notifications</p>
          <Button
            onClick={() => refetch()}
            className="bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const notifications = apiResponse?.data || [];

  return (
    <div className="">
      <div className="">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              {apiResponse?.meta && (
                <p className="text-gray-500 mt-1">
                  {apiResponse.meta.total} notification{apiResponse.meta.total !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <Button
              onClick={handleReadAll}
              disabled={isReadingAll || notifications.length === 0}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isReadingAll ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : null}
              Read All Notifications
            </Button>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No notifications found</p>
                <p className="text-gray-400 mt-1">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const { date, time } = formatDate(notification.createdAt);

                return (
                  <div
                    key={notification._id}
                    className={`flex items-center justify-between p-4 rounded-xl ${getNotificationBgColor(notification.isRead)} hover:bg-gray-100 transition-colors`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.isRead ? 'bg-gray-200' : 'bg-blue-100'
                        }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${notification.isRead ? 'text-gray-700' : 'text-gray-900'
                          }`}>
                          {notification.message}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-sm text-gray-500">
                            {date} / {time}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${notification.isRead
                              ? 'bg-gray-200 text-gray-600'
                              : 'bg-blue-200 text-blue-700'
                            }`}>
                            {notification.isRead ? 'Read' : 'Unread'}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                            {notification.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(notification._id)}
                      disabled={isDeleting}
                      className="w-10 h-10 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                      ) : (
                        <Trash2 className="w-5 h-5 text-red-500" />
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSystem;