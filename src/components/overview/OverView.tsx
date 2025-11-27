"use client";
import { Calendar, Crown, UserCheck, Users } from "lucide-react";
import { useOverViewStateCardQuery } from "../../features/overview/overviewApi";
import EventsLineChart from './EventsLineChart';
import StatsCard from './StatsCard';
import UserDonutChart from './UserDonutChart';
import UserListTable from './UserListTable';

export default function Overview() {
  const { data: stateData } = useOverViewStateCardQuery({});

  // Extract data from API response
  const totalUsers = stateData?.data?.allUsers || 0;
  const totalEvents = stateData?.data?.totalEvents || 0;

  // Extract free and premium users from result array
  const resultData = stateData?.data?.result || [];
  const freeUsers = resultData.find(item => item.type === 'free')?.count || 0;
  const premiumUsers = resultData.find(item => item.type === 'premium')?.count || 0;

  return (
    <div className="">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            icon={Users}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-50"
            value={totalUsers.toString()}
            label="Total Users"
            trend={35}
            isPositive={true}
          />
          <StatsCard
            icon={Calendar}
            iconColor="text-green-600"
            iconBgColor="bg-green-50"
            value={totalEvents.toString()}
            label="Total Events"
            trend={27}
            isPositive={true}
          />
          <StatsCard
            icon={UserCheck}
            iconColor="text-yellow-600"
            iconBgColor="bg-yellow-50"
            value={freeUsers.toString()}
            label="Free Users"
            trend={35}
            isPositive={true}
          />
          <StatsCard
            icon={Crown}
            iconColor="text-red-600"
            iconBgColor="bg-red-50"
            value={premiumUsers.toString()}
            label="Premium Users"
            trend={0.5}
            isPositive={false}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EventsLineChart />
          <UserDonutChart freeUsers={freeUsers} premiumUsers={premiumUsers} totalUsers={totalUsers} />
        </div>

        {/* User List Table */}
        <UserListTable />
      </div>
    </div>
  );
}