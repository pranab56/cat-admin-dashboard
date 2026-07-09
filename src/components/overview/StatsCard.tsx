import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  value: string;
  label: string;

}

export default function StatsCard({
  icon: Icon,
  iconColor,
  iconBgColor,
  value,
  label,
}: StatsCardProps) {
  return (
    <Card className="border-0 shadow-sm p-0">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          {/* Icon */}
          <div className={`w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>

          {/* Value and Label */}
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{label}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}