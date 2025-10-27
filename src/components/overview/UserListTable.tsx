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
import { ChevronLeft, ChevronRight, Search, Slash } from "lucide-react";
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

export default function UserListTable() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(2);

  console.log(currentPage)

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
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 hover:text-gray-900">
                      <Slash className="h-5 w-5" />
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
  );
}