'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';

interface DeleteFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  isLoading?: boolean;
  question: string;
}

export default function DeleteFaqModal({
  isOpen,
  onClose,
  onDelete,
  isLoading = false,
  question,
}: DeleteFaqModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>

          <h2 className="text-xl font-semibold">Delete FAQ</h2>

          <p className="text-gray-500 text-sm">
            Are you sure you want to delete this FAQ? This action cannot be undone.
          </p>

          <p className="text-gray-700 text-sm font-medium bg-gray-50 px-4 py-3 rounded-lg w-full text-left line-clamp-3">
            &quot;{question}&quot;
          </p>

          <div className="flex gap-4 w-full pt-2">
            <Button type="button" onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={onDelete}
              disabled={isLoading}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
