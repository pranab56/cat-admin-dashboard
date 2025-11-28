'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plan } from './types';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
  onDelete: (planId: string) => void;
  isLoading?: boolean;
}

export default function DeleteModal({ isOpen, onClose, plan, onDelete, isLoading = false }: DeleteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Delete Plan</DialogTitle>
        </DialogHeader>

        <p className="text-gray-600 my-6">
          Are you sure you want to delete &quot;{plan?.title}`&quot;? This action cannot be undone.
        </p>

        <div className="flex gap-4">
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (plan) {
                onDelete(plan._id);
              }
            }}
            disabled={isLoading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}