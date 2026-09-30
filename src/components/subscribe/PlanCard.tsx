'use client';

import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { Plan } from './types';

interface PlanCardProps {
  plan: Plan;
  onEdit: (plan: Plan) => void;
  onDelete: (plan: Plan) => void;
}

const AppleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M17.05 20.28c-.98.95-2.05.8-3.09.35-1.1-.46-2.1-.48-3.26 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.1.8 1.2-.24 2.35-.93 3.63-.84 1.54.12 2.7.73 3.47 1.82-3.18 1.9-2.43 6.07.52 7.24-.58 1.5-1.34 2.99-2.72 3.96zM12.03 7.25C11.88 5.02 13.69 3.18 15.75 3c.28 2.58-2.32 4.5-3.72 4.25z" />
  </svg>
);

const GoogleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fill="#4285F4"
      d="M21.35 12.23c0-.79-.07-1.55-.22-2.28H12v4.32h5.22a4.46 4.46 0 0 1-1.94 2.93v2.44h3.14c1.84-1.69 2.93-4.18 2.93-7.41z"
    />
    <path
      fill="#34A853"
      d="M12 21.82c2.63 0 4.84-.87 6.45-2.36l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.52A9.74 9.74 0 0 0 12 21.82z"
    />
    <path
      fill="#FBBC05"
      d="M6.54 13.91A5.85 5.85 0 0 1 6.24 12c0-.66.11-1.3.3-1.91V7.57H3.3A9.75 9.75 0 0 0 2.27 12c0 1.57.38 3.05 1.03 4.43l3.24-2.52z"
    />
    <path
      fill="#EA4335"
      d="M12 6.06c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.84 3.13 14.63 2.18 12 2.18a9.74 9.74 0 0 0-8.7 5.39l3.24 2.52C7.31 7.78 9.46 6.06 12 6.06z"
    />
  </svg>
);

export default function PlanCard({ plan, onEdit, onDelete }: PlanCardProps) {
  // Sort plan prices: Google items together, Apple items together, and month before year/free
  const sortedPrices = [...plan.planPrices].sort((a, b) => {
    const platformA = (a.platform || 'apple').toLowerCase();
    const platformB = (b.platform || 'apple').toLowerCase();

    // Group platforms together (Google first, then Apple, or vice versa)
    if (platformA !== platformB) {
      return platformA === 'google' ? -1 : 1;
    }

    // Sort billing types: month -> year -> free
    const typeOrder: Record<string, number> = { month: 1, year: 2, free: 3 };
    return (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99);
  });

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="flex justify-center mb-3">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Users size={26} />
        </div>
      </div>

      <h3 className="text-xl font-bold text-center mb-4 capitalize text-gray-800">{plan.title}</h3>

      {/* Pricing List Section */}
      <div className="space-y-2 mb-6 w-full">
        {sortedPrices.length === 0 ? (
          <div className="text-center text-xs text-gray-400 py-3 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No prices configured
          </div>
        ) : (
          sortedPrices.map((priceObj, idx) => {
            const isGoogle = (priceObj.platform || 'apple').toLowerCase() === 'google';
            const cycleText =
              priceObj.type === 'month' ? 'Monthly' : priceObj.type === 'year' ? 'Yearly' : 'Free';
            const priceSuffix =
              priceObj.type === 'month' ? '/mo' : priceObj.type === 'year' ? '/yr' : '';

            return (
              <div
                key={priceObj._id || idx}
                className="flex items-center justify-between px-3 py-2 bg-gray-50/80 hover:bg-gray-100/80 rounded-xl border border-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {isGoogle ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <GoogleIcon className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center flex-shrink-0">
                      <AppleIcon className="w-5 h-5" />
                    </div>
                  )}
                  <span className="text-xs font-medium text-gray-700 capitalize">
                    {isGoogle ? 'Google' : 'Apple'} • {cycleText}
                  </span>
                </div>
                <span className="text-sm font-bold text-blue-600">
                  ${priceObj.price.toFixed(2)}
                  {priceSuffix && (
                    <span className="text-xs font-normal text-gray-500">{priceSuffix}</span>
                  )}
                </span>
              </div>
            );
          })
        )}
      </div>

      <div className="text-center mb-4">
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {plan.participantCount} participants/event
        </span>
      </div>

      <div className="space-y-2.5 mb-6 flex-1 pt-2 border-t border-gray-100">
        {plan.benefits.map((benefit: string, index: number) => (
          <div key={index} className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-xs text-gray-600 leading-relaxed">{benefit}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          onClick={() => onDelete(plan)}
          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-medium cursor-pointer shadow-none"
        >
          Delete
        </Button>
        <Button
          onClick={() => onEdit(plan)}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium cursor-pointer"
        >
          Edit
        </Button>
      </div>
    </div>
  );
}
