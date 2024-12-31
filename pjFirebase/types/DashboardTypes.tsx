export interface SalesMetric {
  daily: number;
  weekly: number;
  monthly: number;
}

export interface OrderMetric {
  id: string;
  total: number;
  createdAt: Date;
  items: Array<{ quantity: number }>;
}
