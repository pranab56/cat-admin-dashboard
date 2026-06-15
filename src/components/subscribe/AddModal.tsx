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
import { useEffect, useState } from 'react';

export interface PackageBody {
  title: 'free' | 'basic' | 'premium';
  type: 'month' | 'year' | 'free';
  planType: 'free' | 'paid';
  price: number;
  productId: string;
  platform: 'apple' | 'google';
  benefits: string[];
  participantCount: number;
}

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (plan: PackageBody) => void;
  isLoading?: boolean;
}

const initialForm = {
  title: 'basic' as PackageBody['title'],
  type: 'month' as PackageBody['type'],
  planType: 'paid' as PackageBody['planType'],
  price: '',
  productId: '',
  platform: 'apple' as PackageBody['platform'],
  participantCount: '',
  benefits: [] as string[],
  currentBenefit: '',
};

export default function AddModal({ isOpen, onClose, onAdd, isLoading = false }: AddModalProps) {
  const [form, setForm] = useState(initialForm);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) setForm(initialForm);
  }, [isOpen]);

  // Auto-derive planType and type when title changes
  const handleTitleChange = (title: PackageBody['title']) => {
    if (title === 'free') {
      setForm((prev) => ({ ...prev, title, type: 'free', planType: 'free', price: '0' }));
    } else {
      setForm((prev) => ({
        ...prev,
        title,
        type: prev.type === 'free' ? 'month' : prev.type,
        planType: 'paid',
        price: prev.price === '0' ? '' : prev.price,
      }));
    }
  };

  const addBenefit = () => {
    if (form.currentBenefit.trim()) {
      setForm((prev) => ({
        ...prev,
        benefits: [...prev.benefits, prev.currentBenefit.trim()],
        currentBenefit: '',
      }));
    }
  };

  const removeBenefit = (index: number) => {
    setForm((prev) => ({ ...prev, benefits: prev.benefits.filter((_, i) => i !== index) }));
  };

  const handleSubmit = () => {
    if (!form.participantCount || !form.productId.trim()) return;
    onAdd({
      title: form.title,
      type: form.type,
      planType: form.planType,
      price: parseFloat(form.price) || 0,
      productId: form.productId.trim(),
      platform: form.platform,
      benefits: form.benefits,
      participantCount: parseInt(form.participantCount),
    });
  };

  const isFree = form.title === 'free';
  const isValid =
    form.participantCount &&
    form.productId.trim() &&
    (isFree || parseFloat(form.price) > 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Create a New Plan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">

          {/* Title */}
          <div>
            <Label className="text-sm font-medium">Plan Title</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full bg-blue-50 border-none justify-between mt-2 capitalize">
                  {form.title}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                {(['free', 'basic', 'premium'] as const).map((t) => (
                  <DropdownMenuItem key={t} onClick={() => handleTitleChange(t)} className="capitalize">
                    {t}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Type */}
          <div>
            <Label className="text-sm font-medium">Type</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled={isFree}>
                <Button
                  variant="outline"
                  className="w-full bg-blue-50 border-none justify-between mt-2 capitalize disabled:opacity-60"
                >
                  {form.type}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                <DropdownMenuItem onClick={() => setForm((p) => ({ ...p, type: 'month' }))}>Month</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setForm((p) => ({ ...p, type: 'year' }))}>Year</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Plan Type (auto-derived, read-only) */}
          <div>
            <Label className="text-sm font-medium">Plan Type</Label>
            <Input
              value={form.planType}
              disabled
              className="w-full bg-blue-50 border-none mt-2 capitalize opacity-70 cursor-not-allowed"
            />
          </div>

          {/* Price */}
          <div>
            <Label className="text-sm font-medium">Price ($)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter price..."
              value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
              disabled={isFree}
              className="w-full bg-blue-50 border-none mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          {/* Product ID */}
          <div>
            <Label className="text-sm font-medium">Product ID</Label>
            <Input
              type="text"
              placeholder="e.g. test_subscription"
              value={form.productId}
              onChange={(e) => setForm((p) => ({ ...p, productId: e.target.value }))}
              className="w-full bg-blue-50 border-none mt-2"
            />
          </div>

          {/* Platform */}
          <div>
            <Label className="text-sm font-medium">Platform</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full bg-blue-50 border-none justify-between mt-2 capitalize">
                  {form.platform}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                <DropdownMenuItem onClick={() => setForm((p) => ({ ...p, platform: 'apple' }))}>Apple</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setForm((p) => ({ ...p, platform: 'google' }))}>Google</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Participant Count */}
          <div>
            <Label className="text-sm font-medium">Participant Count</Label>
            <Input
              type="number"
              min="1"
              placeholder="Enter participant count..."
              value={form.participantCount}
              onChange={(e) => setForm((p) => ({ ...p, participantCount: e.target.value }))}
              className="w-full bg-blue-50 border-none mt-2"
            />
          </div>

          {/* Benefits */}
          <div>
            <Label className="text-sm font-medium">Benefits</Label>
            <div className="flex gap-2 mt-2 mb-2">
              <Input
                type="text"
                placeholder="Enter benefit here..."
                value={form.currentBenefit}
                onChange={(e) => setForm((p) => ({ ...p, currentBenefit: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                className="flex-1 bg-blue-50 border-none"
              />
              <Button type="button" onClick={addBenefit} className="bg-blue-500 hover:bg-blue-600" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {form.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg">
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
            <Button type="button" onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !isValid}
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
