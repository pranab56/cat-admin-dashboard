'use client';

import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { useState } from 'react';
import { Plan } from './types';

interface PlanCardProps {
  plan: Plan;
  onEdit: (plan: Plan) => void;
  onDelete: (plan: Plan) => void;
}

export default function PlanCard({ plan, onEdit, onDelete }: PlanCardProps) {
  const [selectedCycle, setSelectedCycle] = useState<'month' | 'year' | 'free'>(
    plan.planPrices.find(p => p.type === 'month') ? 'month' : 
    plan.planPrices.find(p => p.type === 'year') ? 'year' : 'free'
  );

  const getDisplayPrice = () => {
    const priceObj = plan.planPrices.find(p => p.type === selectedCycle);
    if (!priceObj) return { price: '0.00', cycleText: '' };
    
    const price = priceObj.price === 0 ? '0.00' : priceObj.price.toFixed(2);
    const cycleText = selectedCycle === 'month' ? '/month' : 
                     selectedCycle === 'year' ? '/year' : '';
    
    return { price, cycleText };
  };

  const { price, cycleText } = getDisplayPrice();

  const hasMultiplePrices = plan.planPrices.some(p => p.type === 'month' || p.type === 'year');

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex justify-center mb-4">
        <Users size={32} className="text-gray-800" />
      </div>

      <h3 className="text-xl font-semibold text-center mb-4 capitalize">{plan.title}</h3>

      {hasMultiplePrices && (
        <div className="flex justify-center gap-2 mb-4">
          {plan.planPrices.find(p => p.type === 'month') && (
            <Button
              onClick={() => setSelectedCycle('month')}
              className={`px-4 py-1 text-sm rounded-full h-8 ${
                selectedCycle === 'month'
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Monthly
            </Button>
          )}
          {plan.planPrices.find(p => p.type === 'year') && (
            <Button
              onClick={() => setSelectedCycle('year')}
              className={`px-4 py-1 text-sm rounded-full h-8 ${
                selectedCycle === 'year'
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Yearly
            </Button>
          )}
        </div>
      )}

      <div className="text-center mb-6">
        <span className="text-4xl font-bold text-blue-500">${price}</span>
        {cycleText && <span className="text-blue-500 text-lg">{cycleText}</span>}
      </div>

      <div className="text-center mb-4">
        <span className="text-sm text-gray-600">
          {plan.participantCount} participants/event
        </span>
      </div>

      <div className="space-y-3 mb-6">
        {plan.benefits.map((benefit: string, index: number) => (
          <div key={index} className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm text-gray-700">{benefit}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => onDelete(plan)}
          className="flex-1 bg-red-50 hover:bg-red-100 text-red-500"
        >
          Delete
        </Button>
        <Button
          onClick={() => onEdit(plan)}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
        >
          Edit
        </Button>
      </div>
    </div>
  );
}