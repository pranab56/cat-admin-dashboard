'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { question: string; answer: string }) => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
  initialData?: { question: string; answer: string };
}

export default function FaqModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  mode,
  initialData,
}: FaqModalProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuestion(initialData?.question || '');
      setAnswer(initialData?.answer || '');
    }
  }, [isOpen, initialData]);

  const handleSubmit = () => {
    if (!question.trim() || !answer.trim()) return;
    onSubmit({ question: question.trim(), answer: answer.trim() });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {mode === 'create' ? 'Create FAQ' : 'Edit FAQ'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label className="text-sm font-medium">Question</Label>
            <Input
              type="text"
              placeholder="Enter question here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full bg-blue-50 border-none mt-2"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Answer</Label>
            <textarea
              placeholder="Enter answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              className="w-full bg-blue-50 border-none mt-2 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <Button type="button" onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !question.trim() || !answer.trim()}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isLoading
                ? mode === 'create'
                  ? 'Creating...'
                  : 'Saving...'
                : mode === 'create'
                ? 'Create FAQ'
                : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
