// "use client"

// import { Button } from '@/components/ui/button';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Calendar, Crown, UserCheck, Users } from 'lucide-react';
// import { useState } from 'react';
// import EventsLineChart from '../../../components/overview/EventsLineChart';
// import StatsCard from '../../../components/overview/StatsCard';
// import UserDonutChart from '../../../components/overview/UserDonutChart';

// export default function DownloadFilters() {
//   const [timeRange, setTimeRange] = useState('last-weeks');
//   const [userFilter, setUserFilter] = useState('all-users');

//   const handleDownloadCSV = () => {
//     console.log('Downloading CSV with filters:', { timeRange, userFilter });
//     // Implement CSV download logic here
//     alert(`Downloading CSV\nTime Range: ${timeRange}\nUser Filter: ${userFilter}`);
//   };

//   const handleDownloadPDF = () => {
//     console.log('Downloading PDF with filters:', { timeRange, userFilter });
//     // Implement PDF download logic here
//     alert(`Downloading PDF\nTime Range: ${timeRange}\nUser Filter: ${userFilter}`);
//   };

//   return (
//     <div className="w-full space-y-6">
//       <div className="w-ful bg-white/80 rounded-xl shadow-sm p-6">
//         <div className="flex flex-wrap items-center gap-4">
//           {/* Time Range Select */}
//           <Select value={timeRange} onValueChange={setTimeRange}>
//             <SelectTrigger className="w-[180px] bg-[#EBF0FF] border-0 rounded py-6 cursor-pointer text-gray-700 font-medium hover:bg-blue-100/50 transition-colors">
//               <SelectValue placeholder="Select time range" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="last-weeks">Last Weeks</SelectItem>
//               <SelectItem value="last-month">Last Month</SelectItem>
//               <SelectItem value="last-quarter">Last Quarter</SelectItem>
//               <SelectItem value="last-year">Last Year</SelectItem>
//             </SelectContent>
//           </Select>

//           {/* User Filter Select */}
//           <Select value={userFilter} onValueChange={setUserFilter}>
//             <SelectTrigger className="w-[180px] bg-[#EBF0FF] border-0 rounded py-6 cursor-pointer text-gray-700 font-medium hover:bg-blue-100/50 transition-colors">
//               <SelectValue placeholder="Select users" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all-users">All Users</SelectItem>
//               <SelectItem value="active-users">Active Users</SelectItem>
//               <SelectItem value="inactive-users">Inactive Users</SelectItem>
//               <SelectItem value="admin-users">Admin Users</SelectItem>
//             </SelectContent>
//           </Select>

//           {/* Download CSV Button */}
//           <Button
//             onClick={handleDownloadCSV}
//             className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 h-12 rounded shadow-md hover:shadow-lg transition-all"
//           >
//             Download CSV
//           </Button>

//           {/* Download PDF Button */}
//           <Button
//             onClick={handleDownloadPDF}
//             className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 h-12 rounded shadow-md hover:shadow-lg transition-all"
//           >
//             Download PDF
//           </Button>
//         </div>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatsCard
//           icon={Users}
//           iconColor="text-blue-600"
//           iconBgColor="bg-blue-50"
//           value="12,500"
//           label="Total Users"
//           trend={35}
//           isPositive={true}
//         />
//         <StatsCard
//           icon={Calendar}
//           iconColor="text-green-600"
//           iconBgColor="bg-green-50"
//           value="798"
//           label="Total Events"
//           trend={27}
//           isPositive={true}
//         />
//         <StatsCard
//           icon={UserCheck}
//           iconColor="text-yellow-600"
//           iconBgColor="bg-yellow-50"
//           value="4,800"
//           label="Free Users"
//           trend={35}
//           isPositive={true}
//         />
//         <StatsCard
//           icon={Crown}
//           iconColor="text-red-600"
//           iconBgColor="bg-red-50"
//           value="12,500"
//           label="Premium Users"
//           trend={0.5}
//           isPositive={false}
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <EventsLineChart />
//         <UserDonutChart />
//       </div>
//     </div>
//   );
// }


const page = () => {
  return (
    <div>
      Analytics
    </div>
  );
};

export default page;