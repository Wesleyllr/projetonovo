export interface IOrderRepository {
  createOrder(order: Omit<IOrder, "id">): Promise<string>;
}
