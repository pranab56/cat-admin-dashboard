'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import toast from 'react-hot-toast';
import CustomLoading from '../../../components/Loading/CustomLoading';
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

// Define API response types
interface ApiResponse {
  message: string;
  data: Plan[] | Plan;
  success?: boolean;
}

interface ApiError {
  data: {
    message: string;
  };
  status?: number;
}





export default function SubscriptionPlans() {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // API hooks
  const { data: packagesResponse, isLoading: isPackagesLoading, refetch } = useGetAllPackageQuery({});
  const [createPackage, { isLoading: isCreatePackageLoading }] = useCreatePackageMutation();
  const [updatePackage, { isLoading: isUpdatePackageLoading }] = useUpdatePackageMutation();
  const [deletePackage, { isLoading: isDeletePackageLoading }] = useDeletePackageMutation();

  // Extract plans from API response with proper typing
  const plans: Plan[] = packagesResponse?.data as Plan[] || [];

  const handleAddPlan = async (newPlanData: Omit<Plan, '_id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    try {
      const response = await createPackage(newPlanData).unwrap() as ApiResponse;
      refetch(); // Refresh the list
      setIsAddModalOpen(false);
      console.log("add response", response);
      toast.success(response.message || 'Package created successfully!');
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.data?.message || 'Failed to create package');
    }
  };

  const handleEditPlan = async (updatedPlanData: Plan): Promise<void> => {
    try {
      const { _id, ...data } = updatedPlanData;
      const response = await updatePackage({ id: _id, data }).unwrap() as ApiResponse;
      refetch(); // Refresh the list
      setIsEditModalOpen(false);
      setSelectedPlan(null);
      console.log("edit Response", response);
      toast.success(response.message || 'Package updated successfully!');
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Failed to update package:', apiError);
      toast.error(apiError.data?.message || 'Failed to update package');
    }
  };

  const handleDeletePlan = async (planId: string): Promise<void> => {
    try {
      const response = await deletePackage(planId).unwrap() as ApiResponse;
      refetch(); // Refresh the list
      setIsDeleteModalOpen(false);
      setSelectedPlan(null);
      toast.success(response.message || 'Plan deleted successfully!');
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Failed to delete package:', apiError);
      toast.error(apiError.data?.message || 'Failed to delete package');
    }
  };

  const openEditModal = (plan: Plan): void => {
    setSelectedPlan(plan);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (plan: Plan): void => {
    setSelectedPlan(plan);
    setIsDeleteModalOpen(true);
  };

  if (isPackagesLoading) {
    return <CustomLoading />;
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
          {plans.map((plan: Plan) => (
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