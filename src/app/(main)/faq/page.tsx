'use client';

import DeleteFaqModal from '@/components/faq/DeleteFaqModal';
import FaqModal from '@/components/faq/FaqModal';
import CustomLoading from '@/components/Loading/CustomLoading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useCreateFaqMutation,
  useDeleteFaqMutation,
  useGetAllFaqQuery,
  useUpdateFaqMutation,
} from '@/features/faq/faqApi';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const truncateWords = (text: string, wordLimit: number) => {
  const words = text.split(' ');
  if (words.length <= wordLimit) return { truncated: text, isTruncated: false };
  return { truncated: words.slice(0, wordLimit).join(' ') + '...', isTruncated: true };
};

interface Faq {
  _id: string;
  category: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export default function FaqPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);

  const { data: faqResponse, isLoading, refetch } = useGetAllFaqQuery({});
  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation();

  const faqs: Faq[] = faqResponse?.data || [];

  const handleCreate = async (data: { question: string; answer: string }) => {
    try {
      const response = await createFaq({ category: 'payment', ...data }).unwrap() as { message: string };
      refetch();
      setIsCreateOpen(false);
      toast.success(response.message || 'FAQ created successfully!');
    } catch (error: unknown) {
      toast.error((error as { data?: { message?: string } }).data?.message || 'Failed to create FAQ');
    }
  };

  const handleEdit = async (data: { question: string; answer: string }) => {
    if (!selectedFaq) return;
    try {
      const response = await updateFaq({
        id: selectedFaq._id,
        data: { category: 'payment', ...data },
      }).unwrap() as { message: string };
      refetch();
      setIsEditOpen(false);
      setSelectedFaq(null);
      toast.success(response.message || 'FAQ updated successfully!');
    } catch (error: unknown) {
      toast.error((error as { data?: { message?: string } }).data?.message || 'Failed to update FAQ');
    }
  };

  const handleDelete = async () => {
    if (!selectedFaq) return;
    try {
      const response = await deleteFaq(selectedFaq._id).unwrap() as { message: string };
      refetch();
      setIsDeleteOpen(false);
      setSelectedFaq(null);
      toast.success(response.message || 'FAQ deleted successfully!');
    } catch (error: unknown) {
      toast.error((error as { data?: { message?: string } }).data?.message || 'Failed to delete FAQ');
    }
  };

  const openEdit = (faq: Faq) => {
    setSelectedFaq(faq);
    setIsEditOpen(true);
  };

  const openDelete = (faq: Faq) => {
    setSelectedFaq(faq);
    setIsDeleteOpen(true);
  };

  if (isLoading) return <CustomLoading />;

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl font-semibold">FAQ Management</CardTitle>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            + Create FAQ
          </Button>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-12 text-gray-600">#</TableHead>
                <TableHead className="text-gray-600">Question</TableHead>
                <TableHead className="text-gray-600">Answer</TableHead>
                <TableHead className="text-gray-600 text-center w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-gray-400">
                    No FAQs found. Click &quot;+ Create FAQ&quot; to add one.
                  </TableCell>
                </TableRow>
              ) : (
                faqs.map((faq, index) => (
                  <TableRow key={faq._id} className="hover:bg-gray-50">
                    <TableCell className="text-gray-500 font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium text-gray-800 max-w-xs">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-default inline-block">
                              {truncateWords(faq.question, 10).truncated}
                            </span>
                          </TooltipTrigger>
                          {truncateWords(faq.question, 10).isTruncated && (
                            <TooltipContent side="top" align="start" className="max-w-sm text-xs">
                              {faq.question}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-gray-600 max-w-sm">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-default inline-block">
                              {truncateWords(faq.answer, 10).truncated}
                            </span>
                          </TooltipTrigger>
                          {truncateWords(faq.answer, 10).isTruncated && (
                            <TooltipContent side="top" align="start" className="max-w-sm text-xs">
                              {faq.answer}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(faq)}
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDelete(faq)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <FaqModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        isLoading={isCreating}
        mode="create"
      />

      <FaqModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setSelectedFaq(null); }}
        onSubmit={handleEdit}
        isLoading={isUpdating}
        mode="edit"
        initialData={selectedFaq ? { question: selectedFaq.question, answer: selectedFaq.answer } : undefined}
      />

      <DeleteFaqModal
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setSelectedFaq(null); }}
        onDelete={handleDelete}
        isLoading={isDeleting}
        question={selectedFaq?.question || ''}
      />
    </div>
  );
}
