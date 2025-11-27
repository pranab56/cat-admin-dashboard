"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Image from 'next/image';
import { useMemo, useState } from "react";
import { useAllUsersQuery, useBlockUserMutation } from '../../features/overview/overviewApi';
import { baseURL } from '../../utils/BaseURL';

interface User {
  _id: string;
  profile: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  isDeleted: boolean;
  phone: string;
  subscriptionId: string | null;
  isStripeConnectedAccount: boolean;
  userDeviceId: string | null;
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
  data: User[];
}

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isBlocking
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  isBlocking: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isBlocking ? "bg-red-100" : "bg-green-100"
            }`}>
            <svg
              className={`w-8 h-8 ${isBlocking ? "text-red-600" : "text-green-600"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {isBlocking ? "Block User" : "Unblock User"}
          </h3>

          <p className="text-gray-600 mb-6">
            {isBlocking
              ? `Are you sure you want to block <span className="font-semibold">${userName}</span>? This action will restrict their access to the platform.`
              : `Are you sure you want to unblock <span className="font-semibold">${userName}</span>? This action will restore their access to the platform.`
            }
          </p>

          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className={`flex-1 ${isBlocking
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
                } text-white`}
            >
              {isBlocking ? "Yes, Block User" : "Yes, Unblock User"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserListTable() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userTypeFilter, setUserTypeFilter] = useState("all");

  const { data: allUserData, isLoading: allUserLoading, refetch } = useAllUsersQuery({});
  const [blockUser, { isLoading: blockUserLoading }] = useBlockUserMutation();

  const users = allUserData?.data || [];
  const meta = allUserData?.meta;

  // Filter users based on search and filter criteria
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter
      const matchesSearch =
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.isActive) ||
        (statusFilter === "blocked" && !user.isActive);

      // User type filter
      const matchesUserType =
        userTypeFilter === "all" ||
        (userTypeFilter === "premium" && user.subscriptionId) ||
        (userTypeFilter === "free" && !user.subscriptionId);

      return matchesSearch && matchesStatus && matchesUserType;
    });
  }, [users, searchTerm, statusFilter, userTypeFilter]);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u._id));
    }
  };

  const handleBlockClick = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleConfirmBlock = async () => {
    if (selectedUser) {
      try {
        await blockUser(selectedUser._id).unwrap();
        // Refresh the user list after blocking/unblocking
        refetch();
      } catch (error) {
        console.error('Failed to update user status:', error);
      }
    }
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const getStatusVariant = (isActive: boolean) => {
    return isActive
      ? "bg-green-50 text-green-700 hover:bg-green-50"
      : "bg-red-50 text-red-700 hover:bg-red-50";
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? "Active" : "Blocked";
  };

  const getUserType = (user: User) => {
    return user.subscriptionId ? "Premium" : "Free";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getLastActive = (updatedAt: string) => {
    const updated = new Date(updatedAt);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  if (allUserLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="text-center">Loading users...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              User List
            </CardTitle>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search here..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9 w-64 pl-9 pr-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 h-9 bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>

              {/* User Type Filter */}
              <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                <SelectTrigger className="w-32 h-9 bg-gray-50 border-gray-200">
                  <SelectValue placeholder="User Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onCheckedChange={toggleAllUsers}
                    />
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">User Name</TableHead>
                  <TableHead className="font-semibold text-gray-700">Email Address</TableHead>
                  <TableHead className="font-semibold text-gray-700">User Type</TableHead>
                  <TableHead className="font-semibold text-gray-700">Join Date</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700">Last Active</TableHead>
                  <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No users found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user._id} className="hover:bg-gray-50">
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user._id)}
                          onCheckedChange={() => toggleUserSelection(user._id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {user.profile && !user.profile.includes('default-user') ? (
                              <Image
                                src={baseURL + "/" + user.profile || ""}
                                alt={user.fullName}
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-xs font-medium text-gray-600">
                                {user.fullName.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          {user.fullName}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{user.email}</TableCell>
                      <TableCell className="text-gray-900">
                        <Badge className={
                          getUserType(user) === 'Premium'
                            ? "bg-purple-50 text-purple-700 hover:bg-purple-50"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-50"
                        }>
                          {getUserType(user)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusVariant(user.isActive)}>
                          {getStatusText(user.isActive)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{getLastActive(user.updatedAt)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-600 hover:text-gray-900"
                          onClick={() => handleBlockClick(user)}
                          disabled={blockUserLoading}
                        >
                          <Image
                            src={
                              user.isActive
                                ? "/icons/users/block.png"
                                : "/icons/users/block.png"
                            }
                            width={20}
                            height={20}
                            alt={user.isActive ? "Block" : "Unblock"}
                          />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {meta && filteredUsers.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Showing {filteredUsers.length} of {users.length} Results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: Math.min(4, meta.totalPage) }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    className={`h-9 w-9 ${currentPage === i + 1 ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setCurrentPage((p) => Math.min(meta.totalPage, p + 1))}
                  disabled={currentPage === meta.totalPage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmationModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmBlock}
        userName={selectedUser?.fullName || ""}
        isBlocking={selectedUser?.isActive || false}
      />
    </>
  );
}