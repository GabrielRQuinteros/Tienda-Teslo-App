export interface OrderFilters {
  maxAmount?: number;
  minAmount?: number;
  amount?: number;
  orderId?: string;
  userId?: string;
  date?: Date;
  isPaid?: boolean;
}

export interface UserFilters {
  id?: string,
  name?: string,
  email?: string,
  isActive?: boolean,
  roles?: string[],
}

