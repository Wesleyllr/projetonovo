export interface IProduct {
  id: string;
  title: string;
  value: number;
  imageUrl?: string;
  quantity: number;
}

export interface ICartItem extends IProduct {
  observations?: string;
}

export interface IOrder {
  id: string;
  userId: string;
  items: ICartItem[];
  total: number;
  status: "completed" | "pending" | "canceled";
  createdAt: Date;
}
