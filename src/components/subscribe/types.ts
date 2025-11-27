export interface PlanPrice {
  type: string;
  price: number;
  priceId?: string;
  productId?: string;
  _id?: string;
}

export interface Plan {
  _id: string;
  title: string;
  planPrices: PlanPrice[];
  benefits: string[];
  participantCount: number;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const initialPlans: Plan[] = [];