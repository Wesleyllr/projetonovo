export interface IProduct {
  id: string;
  title: string;
  value: number;
  imageUrl?: string;
  quantity: number;
}

interface ICartItem extends IProduct {
  observations?: string;
}

interface IOrder {
  id: string;
  userId: string;
  items: ICartItem[];
  total: number;
  status: "completed" | "pending";
  createdAt: Date;
}
