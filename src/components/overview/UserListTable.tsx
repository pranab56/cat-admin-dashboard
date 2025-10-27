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
import { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  userType: "Free" | "Premium";
  joinDate: string;
  status: "Confirmed" | "Banned" | "Pending";
  lastActive: string;
}

const users: User[] = [
  {
    id: "1",
    name: "Wade Warren",
    email: "alma.lawson@example.com",
    userType: "Free",
    joinDate: "12/09/2025",
    status: "Confirmed",
    lastActive: "2h ago",
  },
  {
    id: "2",
    name: "Wade Warren",
    email: "alma.lawson@example.com",
    userType: "Free",
    joinDate: "12/09/2025",
    status: "Confirmed",
    lastActive: "2h ago",
  },
  {
    id: "3",
    name: "Wade Warren",
    email: "alma.lawson@example.com",
    userType: "Premium",
    joinDate: "12/09/2025",
    status: "Banned",
    lastActive: "2h ago",
  },
  {
    id: "4",
    name: "Wade Warren",
    email: "alma.lawson@example.com",
    userType: "Free",
    joinDate: "12/09/2025",
    status: "Pending",
    lastActive: "2h ago",
  },
  {
    id: "5",
    name: "Wade Warren",
    email: "alma.lawson@example.com",
    userType: "Free",
    joinDate: "12/09/2025",
    status: "Confirmed",
    lastActive: "2h ago",
  },
];

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  userName
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-600"
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
            Block User
          </h3>

          <p className="text-gray-600 mb-6">
            Are you sure you want to block <span className="font-semibold">{userName}</span>?
            This action will restrict their access to the platform.
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
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Yes, Block User
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserListTable() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(2);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((u) => u.id));
    }
  };

  const handleBlockClick = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleConfirmBlock = () => {
    if (selectedUser) {
      // Here you would typically make an API call to block the user
      console.log(`Blocking user: ${selectedUser.name} (${selectedUser.id})`);
      // You can update the user's status to "Banned" in your state here
    }
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-50 text-green-700 hover:bg-green-50";
      case "Banned":
        return "bg-red-50 text-red-700 hover:bg-red-50";
      case "Pending":
        return "bg-yellow-50 text-yellow-700 hover:bg-yellow-50";
      default:
        return "bg-gray-50 text-gray-700 hover:bg-gray-50";
    }
  };

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
                  className="h-9 w-64 pl-9 pr-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <Select defaultValue="all">
                <SelectTrigger className="w-32 h-9 bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              {/* User Type Filter */}
              <Select defaultValue="all">
                <SelectTrigger className="w-32 h-9 bg-gray-50 border-gray-200">
                  <SelectValue placeholder="User Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">User Type</SelectItem>
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
                      checked={selectedUsers.length === users.length}
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
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => toggleUserSelection(user.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">{user.name}</TableCell>
                    <TableCell className="text-gray-600">{user.email}</TableCell>
                    <TableCell className="text-gray-900">{user.userType}</TableCell>
                    <TableCell className="text-gray-600">{user.joinDate}</TableCell>
                    <TableCell>
                      <Badge className={getStatusVariant(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{user.lastActive}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-600 hover:text-gray-900"
                        onClick={() => handleBlockClick(user)}
                      >
                        <Image src="/icons/users/block.png" width={20} height={20} alt="Block" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">Showing 5 of 205 Results</div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9"
                onClick={() => setCurrentPage(1)}
              >
                01
              </Button>
              <Button
                variant="default"
                size="sm"
                className="h-9 w-9 bg-blue-600 hover:bg-blue-700"
              >
                02
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9"
                onClick={() => setCurrentPage(3)}
              >
                03
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9"
                onClick={() => setCurrentPage(4)}
              >
                04
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmationModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmBlock}
        userName={selectedUser?.name || ""}
      />
    </>
  );
}