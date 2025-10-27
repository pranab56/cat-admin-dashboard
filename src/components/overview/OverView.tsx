
import { Calendar, Crown, UserCheck, Users } from "lucide-react";
import EventsLineChart from './EventsLineChart';
import StatsCard from './StatsCard';
import UserDonutChart from './UserDonutChart';
import UserListTable from './UserListTable';

export default function Overview() {
  return (
    <div className="">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            icon={Users}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-50"
            value="12,500"
            label="Total Users"
            trend={35}
            isPositive={true}
          />
          <StatsCard
            icon={Calendar}
            iconColor="text-green-600"
            iconBgColor="bg-green-50"
            value="798"
            label="Total Events"
            trend={27}
            isPositive={true}
          />
          <StatsCard
            icon={UserCheck}
            iconColor="text-yellow-600"
            iconBgColor="bg-yellow-50"
            value="4,800"
            label="Free Users"
            trend={35}
            isPositive={true}
          />
          <StatsCard
            icon={Crown}
            iconColor="text-red-600"
            iconBgColor="bg-red-50"
            value="12,500"
            label="Premium Users"
            trend={0.5}
            isPositive={false}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EventsLineChart />
          <UserDonutChart />
        </div>

        {/* User List Table */}
        <UserListTable />
      </div>
    </div>
  );
}