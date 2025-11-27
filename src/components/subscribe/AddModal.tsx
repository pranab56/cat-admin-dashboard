'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Plan, PlanPrice } from './types';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (plan: Omit<Plan, '_id' | 'createdAt' | 'updatedAt'>) => void;
  isLoading?: boolean;
}

export default function AddModal({ isOpen, onClose, onAdd, isLoading = false }: AddModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    participantCount: '',
    benefits: [] as string[],
    currentBenefit: '',
    planPrices: [] as PlanPrice[],
    currentPriceType: 'month' as 'free' | 'month' | 'year',
    currentPrice: '',
  });

  const handleAdd = () => {
    if (!formData.title || !formData.participantCount) return;

    const newPlan = {
      title: formData.title,
      participantCount: parseInt(formData.participantCount),
      benefits: formData.benefits,
      planPrices: formData.planPrices,
    };

    onAdd(newPlan);

    // Reset form
    setFormData({
      title: '',
      participantCount: '',
      benefits: [],
      currentBenefit: '',
      planPrices: [],
      currentPriceType: 'month',
      currentPrice: '',
    });
  };

  const addBenefit = () => {
    if (formData.currentBenefit.trim()) {
      setFormData({
        ...formData,
        benefits: [...formData.benefits, formData.currentBenefit.trim()],
        currentBenefit: '',
      });
    }
  };

  const addPrice = () => {
    if (formData.currentPrice && !isNaN(parseFloat(formData.currentPrice))) {
      const newPrice: PlanPrice = {
        type: formData.currentPriceType,
        price: parseFloat(formData.currentPrice),
      };

      setFormData({
        ...formData,
        planPrices: [...formData.planPrices, newPrice],
        currentPrice: '',
      });
    }
  };

  const removeBenefit = (index: number) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter((_, i) => i !== index),
    });
  };

  const removePrice = (index: number) => {
    setFormData({
      ...formData,
      planPrices: formData.planPrices.filter((_, i) => i !== index),
    });
  };

  const getPriceTypeLabel = (type: string) => {
    switch (type) {
      case 'free': return 'Free';
      case 'month': return 'Monthly';
      case 'year': return 'Yearly';
      default: return type;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Create a New Plan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="plan-name" className="text-sm font-medium mb-2">
              Plan Name
            </Label>
            <Input
              id="plan-name"
              type="text"
              placeholder="Enter plan name here..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-blue-50 border-none mt-2"
            />
          </div>

          <div>
            <Label htmlFor="participant-count" className="text-sm font-medium mb-2">
              Participant Count
            </Label>
            <Input
              id="participant-count"
              type="number"
              placeholder="Enter participant count..."
              value={formData.participantCount}
              onChange={(e) => setFormData({ ...formData, participantCount: e.target.value })}
              className="w-full bg-blue-50 border-none mt-2"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2">Pricing</Label>
            <div className="flex gap-2 mt-2 mb-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 bg-blue-50 border-none justify-between"
                  >
                    {getPriceTypeLabel(formData.currentPriceType)}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem
                    onClick={() => setFormData({ ...formData, currentPriceType: 'free' })}
                  >
                    Free
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFormData({ ...formData, currentPriceType: 'month' })}
                  >
                    Monthly
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFormData({ ...formData, currentPriceType: 'year' })}
                  >
                    Yearly
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Input
                type="number"
                step="0.01"
                placeholder="Price"
                value={formData.currentPrice}
                onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                className="flex-1 bg-blue-50 border-none"
                disabled={formData.currentPriceType === 'free'}
              />
              <Button
                type="button"
                onClick={addPrice}
                className="bg-blue-500 hover:bg-blue-600"
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.planPrices.map((price, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm">
                    {getPriceTypeLabel(price.type)}: {price.type === 'free' ? 'Free' : `$${price.price}`}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removePrice(index)}
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2">Benefits</Label>
            <div className="flex gap-2 mt-2 mb-2">
              <Input
                type="text"
                placeholder="Enter benefit here..."
                value={formData.currentBenefit}
                onChange={(e) => setFormData({ ...formData, currentBenefit: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                className="flex-1 bg-blue-50 border-none"
              />
              <Button
                type="button"
                onClick={addBenefit}
                className="bg-blue-500 hover:bg-blue-600"
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm">{benefit}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBenefit(index)}
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={isLoading || !formData.title || !formData.participantCount}
              className="flex-1 bg-blue-500 hover:bg-blue-600 font-medium"
            >
              {isLoading ? 'Adding...' : 'Add Plan'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}