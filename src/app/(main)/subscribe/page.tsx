'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import toast from 'react-hot-toast';
import CustomLoading from '../../../components/Loading/CustomLoading';
import AddModal, { PackageBody } from '../../../components/subscribe/AddModal';
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

interface RawPackage {
  _id: string;
  title: string;
  type: string;
  planType: string;
  price: number;
  productId: string;
  platform: string;
  benefits: string[];
  participantCount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

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

  // API hooks - fetch all packages without filtering by platform
  const { data: packagesResponse, isLoading: isPackagesLoading, refetch } = useGetAllPackageQuery({});
  const [createPackage, { isLoading: isCreatePackageLoading }] = useCreatePackageMutation();
  const [updatePackage, { isLoading: isUpdatePackageLoading }] = useUpdatePackageMutation();
  const [deletePackage, { isLoading: isDeletePackageLoading }] = useDeletePackageMutation();

  // Group flat API packages by title into the Plan shape (with planPrices[])
  const groupPackagesByTitle = (packages: RawPackage[]): Plan[] => {
    const grouped: Record<string, Plan> = {};
    packages.forEach((pkg) => {
      if (!grouped[pkg.title]) {
        grouped[pkg.title] = {
          _id: pkg._id,
          title: pkg.title,
          planPrices: [],
          benefits: pkg.benefits,
          participantCount: pkg.participantCount,
          isDeleted: pkg.isDeleted,
          createdAt: pkg.createdAt,
          updatedAt: pkg.updatedAt,
        };
      }
      grouped[pkg.title].planPrices.push({
        type: pkg.type,
        price: pkg.price,
        productId: pkg.productId,
        platform: pkg.platform,
        _id: pkg._id,
      });
    });
    return Object.values(grouped);
  };

  const rawPackages: RawPackage[] = (packagesResponse?.data as RawPackage[]) || [];
  const plans: Plan[] = groupPackagesByTitle(rawPackages);

  const handleAddPlan = async (newPlanData: PackageBody): Promise<void> => {
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

  const handleEditPlan = async (updatedPlanData: Plan, removedPriceIds: string[] = []): Promise<void> => {
    try {
      const { title, participantCount, benefits, planPrices } = updatedPlanData;

      // 1. Delete removed pricing package documents
      if (removedPriceIds.length > 0) {
        await Promise.all(removedPriceIds.map((id) => deletePackage(id).unwrap()));
      }

      // 2. Update existing or Create new pricing package documents
      const promises = planPrices.map((priceItem) => {
        const payload = {
          title,
          type: priceItem.type,
          planType: priceItem.type === 'free' ? 'free' : 'paid',
          price: priceItem.price,
          productId: priceItem.productId || '',
          platform: priceItem.platform || 'apple',
          participantCount,
          benefits,
        };

        if (priceItem._id) {
          return updatePackage({ id: priceItem._id, data: payload }).unwrap();
        } else {
          return createPackage(payload).unwrap();
        }
      });

      await Promise.all(promises);

      refetch(); // Refresh the list
      setIsEditModalOpen(false);
      setSelectedPlan(null);
      toast.success('Package updated successfully!');
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Failed to update package:', apiError);
      toast.error(apiError.data?.message || 'Failed to update package');
    }
  };

  const handleDeletePlan = async (planId: string): Promise<void> => {
    try {
      if (selectedPlan && selectedPlan.planPrices.length > 0) {
        await Promise.all(
          selectedPlan.planPrices
            .filter((p) => p._id)
            .map((p) => deletePackage(p._id!).unwrap())
        );
      } else {
        await deletePackage(planId).unwrap();
      }
      refetch(); // Refresh the list
      setIsDeleteModalOpen(false);
      setSelectedPlan(null);
      toast.success('Plan deleted successfully!');
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
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Subscription Plans</h1>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
            disabled={isCreatePackageLoading}
          >
            {isCreatePackageLoading ? 'Adding...' : 'Add Subscription Plan'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-6 items-stretch">
          {plans?.reverse()?.map((plan: Plan) => (
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