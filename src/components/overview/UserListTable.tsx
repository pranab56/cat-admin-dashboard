"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import { useAllUsersQuery, useBlockUserMutation } from '../../features/overview/overviewApi';
import { baseURL } from '../../utils/BaseURL';
import CustomLoading from '../Loading/CustomLoading';

interface User {
  _id: string;
  profile: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  isDeleted: boolean;
  phone: string;
  subscriptionPlanType: string | null;
  subscriptionId: string | null;
  isStripeConnectedAccount: boolean;
  userDeviceId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  isBlocking: boolean;
}

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isBlocking,
}: ConfirmationModalProps): React.ReactElement | null {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isBlocking ? "bg-red-100" : "bg-green-100"}`}>
            <svg className={`w-8 h-8 ${isBlocking ? "text-red-600" : "text-green-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {isBlocking ? "Block User" : "Unblock User"}
          </h3>
          <p className="text-gray-600 mb-6">
            {isBlocking
              ? `Are you sure you want to block ${userName}? This will restrict their access.`
              : `Are you sure you want to unblock ${userName}? This will restore their access.`}
          </p>
          <div className="flex gap-3 w-full">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button
              onClick={onConfirm}
              className={`flex-1 ${isBlocking ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} text-white`}
            >
              {isBlocking ? "Yes, Block" : "Yes, Unblock"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserListTable(): React.ReactElement {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [userTypeFilter, setUserTypeFilter] = useState<string>("all");

  // Pass currentPage to API — this triggers a new fetch on every page change
  const { data: allUserData, isLoading: allUserLoading, isFetching, refetch } = useAllUsersQuery({ page: currentPage });
  const [blockUser, { isLoading: blockUserLoading }] = useBlockUserMutation();

  const users: User[] = useMemo(() => allUserData?.data || [], [allUserData?.data]);
  const meta = allUserData?.meta;

  // Client-side filter on the current page's data
  const filteredUsers = useMemo(() => {
    return users.filter((user: User) => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.isActive) ||
        (statusFilter === "blocked" && !user.isActive);

      const matchesUserType =
        userTypeFilter === "all" ||
        (userTypeFilter === "premium" && user.subscriptionPlanType && user.subscriptionPlanType !== 'free') ||
        (userTypeFilter === "free" && (!user.subscriptionPlanType || user.subscriptionPlanType === 'free'));

      return matchesSearch && matchesStatus && matchesUserType;
    });
  }, [users, searchTerm, statusFilter, userTypeFilter]);

  const handleBlockClick = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleConfirmBlock = async () => {
    if (selectedUser) {
      try {
        await blockUser(selectedUser._id).unwrap();
        refetch();
      } catch (error) {
        console.error('Failed to update user status:', error);
      }
    }
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleUserTypeFilterChange = (value: string) => {
    setUserTypeFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusVariant = (isActive: boolean) =>
    isActive ? "bg-green-50 text-green-700 hover:bg-green-50" : "bg-red-50 text-red-700 hover:bg-red-50";

  const getUserType = (user: User) => {
    if (!user.subscriptionPlanType || user.subscriptionPlanType === 'free') return 'Free';
    return 'Premium';
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

  const getLastActive = (dateString: string) => {
    const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60));
    if (diff < 1) return 'Just now';
    if (diff < 24) return `${diff}h ago`;
    return `${Math.floor(diff / 24)}d ago`;
  };

  // Pagination helpers
  const totalPages = meta?.totalPage || 1;
  const startItem = meta ? (currentPage - 1) * meta.limit + 1 : 1;
  const endItem = meta ? Math.min(currentPage * meta.limit, meta.total) : 0;

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    return pages;
  };

  if (allUserLoading) return <CustomLoading />;

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">User List</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search here..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="h-9 w-64 pl-9 pr-4 rounded-lg border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger className="w-32 h-9 bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
              <Select value={userTypeFilter} onValueChange={handleUserTypeFilterChange}>
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
          {/* Table with loading overlay */}
          <div className="relative rounded-lg border border-gray-200">
            {isFetching && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-lg">
                <div className="flex items-center gap-2 text-blue-600">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm font-medium">Loading...</span>
                </div>
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
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
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No users found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user: User) => (
                    <TableRow key={user._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {user.profile && !user.profile.includes('default-user') ? (
                              <Image src={baseURL + "/" + user.profile} alt={user.fullName} width={32} height={32} className="w-full h-full object-cover" />
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
                      <TableCell>
                        <Badge className={getUserType(user) === 'Premium' ? "bg-purple-50 text-purple-700 hover:bg-purple-50" : "bg-gray-50 text-gray-700 hover:bg-gray-50"}>
                          {getUserType(user)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusVariant(user.isActive)}>
                          {user.isActive ? "Active" : "Blocked"}
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
                          <Image src="/icons/users/block.png" width={20} height={20} alt={user.isActive ? "Block" : "Unblock"} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPage > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Showing {startItem}–{endItem} of {meta.total} Results
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isFetching}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {getPageNumbers().map((page, idx) =>
                  page === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 select-none">...</span>
                  ) : (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className={`h-9 w-9 ${currentPage === page ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
                      onClick={() => handlePageChange(page as number)}
                      disabled={isFetching}
                    >
                      {String(page).padStart(2, '0')}
                    </Button>
                  )
                )}

                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isFetching}
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
        onClose={() => { setModalOpen(false); setSelectedUser(null); }}
        onConfirm={handleConfirmBlock}
        userName={selectedUser?.fullName || ""}
        isBlocking={selectedUser?.isActive || false}
      />
    </>
  );
}
