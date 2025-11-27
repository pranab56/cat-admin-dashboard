'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import toast from 'react-hot-toast';
import AddModal from '../../../components/subscribe/AddModal';
import DeleteModal from '../../../components/subscribe/DeleteModal';
import EditModal from '../../../components/subscribe/EditModal';
import PlanCard from '../../../components/subscribe/PlanCard';
import { Plan } from '../../../components/subscribe/types';
import {
  useCreatePackageMutation,
  useDeletePackageMutation,
  useGetAllPackageQuery,
  useUpdatePackageMutation
} from '../../../features/subscribe/subscribeApi';

export default function SubscriptionPlans() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // API hooks
  const { data: packagesResponse, isLoading: isPackagesLoading, refetch } = useGetAllPackageQuery({});
  const [createPackage, { isLoading: isCreatePackageLoading }] = useCreatePackageMutation();
  const [updatePackage, { isLoading: isUpdatePackageLoading }] = useUpdatePackageMutation();
  const [deletePackage, { isLoading: isDeletePackageLoading }] = useDeletePackageMutation();

  // Extract plans from API response
  const plans = packagesResponse?.data || [];

  const handleAddPlan = async (newPlanData: Omit<Plan, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await createPackage(newPlanData).unwrap();
      refetch(); // Refresh the list
      setIsAddModalOpen(false);
      console.log("add response", response)
      toast.success(response.message || 'Package created successfully!');
    } catch (error) {
      toast.error(error.data.message || 'Failed to create package:');
    }
  };

  const handleEditPlan = async (updatedPlanData: Plan) => {
    try {
      const { _id, ...data } = updatedPlanData;
      const response = await updatePackage({ id: _id, data }).unwrap();
      refetch(); // Refresh the list
      setIsEditModalOpen(false);
      setSelectedPlan(null);
      console.log("edit Response", response)
      toast.success(response.message || 'Package updated successfully!');
    } catch (error) {
      console.error('Failed to update package:', error);
      toast.error(error.data.message || 'Failed to create package:');
    }
  };

  const handleDeletePlan = async (planId: string) => {

    // console.log(planId)
    try {
      const response = await deletePackage(planId).unwrap();
      refetch(); // Refresh the list
      setIsDeleteModalOpen(false);
      toast.success(response.message || 'Plan deleted successfully!');
      setSelectedPlan(null);
      toast.success(response.message || 'Plan deleted successfully!');
    } catch (error) {
      console.error('Failed to delete package:', error);
      toast.error(error.data.message || 'Failed to create package:');
    }
  };

  const openEditModal = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsDeleteModalOpen(true);
  };

  if (isPackagesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex items-center justify-center">
        <div className="text-center">Loading packages...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="">
        <div className="flex justify-end mb-8">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
            disabled={isCreatePackageLoading}
          >
            {isCreatePackageLoading ? 'Adding...' : 'Add Subscription Plan'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <PlanCard
              key={plan._id}
              plan={plan}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />
          ))}
        </div>

        {plans.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No subscription plans found.</p>
          </div>
        )}
      </div>

      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddPlan}
        isLoading={isCreatePackageLoading}
      />

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPlan(null);
        }}
        plan={selectedPlan}
        onSave={handleEditPlan}
        isLoading={isUpdatePackageLoading}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedPlan(null);
        }}
        plan={selectedPlan}
        onDelete={handleDeletePlan}
        isLoading={isDeletePackageLoading}
      />
    </div>
  );
}