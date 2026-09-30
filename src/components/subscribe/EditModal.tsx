'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plan, PlanPrice } from './types';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
  onSave: (plan: Plan, removedPriceIds: string[]) => void;
  isLoading?: boolean;
}

export default function EditModal({ isOpen, onClose, plan, onSave, isLoading = false }: EditModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    participantCount: '',
    benefits: [] as string[],
    currentBenefit: '',
    planPrices: [] as PlanPrice[],
  });

  const [removedPriceIds, setRemovedPriceIds] = useState<string[]>([]);

  // States for adding a new price option
  const [newType, setNewType] = useState<'month' | 'year' | 'free'>('month');
  const [newPrice, setNewPrice] = useState<string>('');
  const [newProductId, setNewProductId] = useState<string>('');
  const [newPlatform, setNewPlatform] = useState<'apple' | 'google'>('apple');

  useEffect(() => {
    if (plan) {
      setFormData({
        title: plan.title,
        participantCount: plan.participantCount ? plan.participantCount.toString() : '0',
        benefits: plan.benefits || [],
        currentBenefit: '',
        planPrices: plan.planPrices ? [...plan.planPrices] : [],
      });
      setRemovedPriceIds([]);
      setNewType('month');
      setNewPrice('');
      setNewProductId('');
      setNewPlatform('apple');
    }
  }, [plan]);

  const handleSave = () => {
    if (!plan) return;

    const updatedPlan: Plan = {
      ...plan,
      title: formData.title,
      participantCount: parseInt(formData.participantCount) || 0,
      benefits: formData.benefits,
      planPrices: formData.planPrices,
    };

    onSave(updatedPlan, removedPriceIds);
  };

  const addBenefit = () => {
    if (formData.currentBenefit.trim()) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, prev.currentBenefit.trim()],
        currentBenefit: '',
      }));
    }
  };

  const removeBenefit = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const handleAddNewPrice = () => {
    if (!newProductId.trim()) {
      toast.error('Please enter a Product ID');
      return;
    }

    if (newType !== 'free' && (!newPrice || parseFloat(newPrice) < 0)) {
      toast.error('Please enter a valid price');
      return;
    }

    const priceObj: PlanPrice = {
      type: newType,
      price: newType === 'free' ? 0 : parseFloat(newPrice),
      productId: newProductId.trim(),
      platform: newPlatform,
    };

    setFormData((prev) => ({
      ...prev,
      planPrices: [...prev.planPrices, priceObj],
    }));

    setNewPrice('');
    setNewProductId('');
    toast.success('Pricing option added to list');
  };

  const handleRemovePrice = (index: number) => {
    const target = formData.planPrices[index];
    if (target?._id) {
      setRemovedPriceIds((prev) => [...prev, target._id!]);
    }
    setFormData((prev) => ({
      ...prev,
      planPrices: prev.planPrices.filter((_, i) => i !== index),
    }));
  };

  const handleUpdatePriceItem = (index: number, field: keyof PlanPrice, value: PlanPrice[keyof PlanPrice]) => {
    setFormData((prev) => {
      const updated = [...prev.planPrices];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      if (field === 'type' && value === 'free') {
        updated[index].price = 0;
      }
      return { ...prev, planPrices: updated };
    });
  };

  if (!plan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Edit Plan</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Plan Title */}
          <div>
            <Label className="text-sm font-medium mb-1 block">Plan Name</Label>
            <Input
              type="text"
              disabled
              value={formData.title}
              className="w-full bg-gray-100 border-none capitalize font-semibold cursor-not-allowed text-gray-700"
            />
          </div>

          {/* Participant Count */}
          <div>
            <Label className="text-sm font-medium mb-1 block">Participant Count</Label>
            <Input
              type="number"
              value={formData.participantCount}
              onChange={(e) => setFormData({ ...formData, participantCount: e.target.value })}
              className="w-full bg-blue-50 border-none"
            />
          </div>

          {/* Pricing Options Section */}
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
            <Label className="text-base font-semibold block text-gray-800">
              Pricing Options ({formData.planPrices.length})
            </Label>

            {/* List of current prices */}
            {formData.planPrices.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No pricing options added yet.</p>
            ) : (
              <div className="space-y-3">
                {formData.planPrices.map((price, index) => (
                  <div
                    key={price._id || index}
                    className="p-4 bg-white border border-gray-200 rounded-xl shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full uppercase">
                          {price.type === 'month' ? 'Monthly' : price.type === 'year' ? 'Yearly' : 'Free'}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 bg-purple-100 text-purple-700 rounded-full uppercase">
                          {price.platform || 'apple'}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePrice(index)}
                        className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="Remove pricing"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-medium text-gray-600 mb-1 block">Type</Label>
                        <Select
                          value={price.type}
                          onValueChange={(val) => handleUpdatePriceItem(index, 'type', val)}
                        >
                          <SelectTrigger className="w-full bg-gray-50 border-gray-200 text-sm h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="month">Monthly</SelectItem>
                            <SelectItem value="year">Yearly</SelectItem>
                            <SelectItem value="free">Free</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-xs font-medium text-gray-600 mb-1 block">Platform</Label>
                        <Select
                          value={price.platform || 'apple'}
                          onValueChange={(val) => handleUpdatePriceItem(index, 'platform', val)}
                        >
                          <SelectTrigger className="w-full bg-gray-50 border-gray-200 text-sm h-9 capitalize">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="google">Google</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-xs font-medium text-gray-600 mb-1 block">Price ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          disabled={price.type === 'free'}
                          value={price.type === 'free' ? 0 : price.price}
                          onChange={(e) =>
                            handleUpdatePriceItem(index, 'price', parseFloat(e.target.value) || 0)
                          }
                          className="bg-gray-50 border-gray-200 text-sm h-9"
                        />
                      </div>

                      <div>
                        <Label className="text-xs font-medium text-gray-600 mb-1 block">Product ID</Label>
                        <Input
                          type="text"
                          value={price.productId || ''}
                          onChange={(e) => handleUpdatePriceItem(index, 'productId', e.target.value)}
                          placeholder="e.g. 30_days_premium"
                          className="bg-gray-50 border-gray-200 text-sm h-9"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Price Form */}
            <div className="pt-3 border-t border-gray-200">
              <Label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block mb-2">
                Add New Pricing Option
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Type</Label>
                  <Select
                    value={newType}
                    onValueChange={(val: 'month' | 'year' | 'free') => setNewType(val)}
                  >
                    <SelectTrigger className="w-full bg-white border-gray-200 text-sm h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Monthly</SelectItem>
                      <SelectItem value="year">Yearly</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Platform</Label>
                  <Select
                    value={newPlatform}
                    onValueChange={(val: 'apple' | 'google') => setNewPlatform(val)}
                  >
                    <SelectTrigger className="w-full bg-white border-gray-200 text-sm h-9 capitalize">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Price ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="e.g. 9.99"
                    disabled={newType === 'free'}
                    value={newType === 'free' ? '0' : newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="bg-white border-gray-200 text-sm h-9"
                  />
                </div>

                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Product ID</Label>
                  <Input
                    type="text"
                    placeholder="e.g. 30_days_premium"
                    value={newProductId}
                    onChange={(e) => setNewProductId(e.target.value)}
                    className="bg-white border-gray-200 text-sm h-9"
                  />
                </div>
              </div>

              <Button
                type="button"
                onClick={handleAddNewPrice}
                className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 h-9 font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Pricing Option
              </Button>
            </div>
          </div>

          {/* Benefits Section */}
          <div>
            <Label className="text-sm font-medium mb-1 block">Benefits</Label>
            <div className="flex gap-2 mt-1 mb-2">
              <Input
                type="text"
                placeholder="Enter benefit here..."
                value={formData.currentBenefit}
                onChange={(e) => setFormData({ ...formData, currentBenefit: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                className="flex-1 bg-blue-50 border-none"
              />
              <Button
                type="button"
                onClick={addBenefit}
                className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {formData.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg text-sm"
                >
                  <span>{benefit}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBenefit(index)}
                    className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Dialog Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium cursor-pointer"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
