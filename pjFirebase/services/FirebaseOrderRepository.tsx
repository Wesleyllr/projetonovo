import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "@/firebaseConfig";
import { IOrderRepository } from "./interfaces/IOrderRepository";
import { IOrder } from "@/types/CartTypes";

export class FirebaseOrderRepository implements IOrderRepository {
  private readonly ORDERS_COLLECTION = "orders";

  async createOrder(orderData: Omit<IOrder, "id">): Promise<string> {
    try {
      const orderRef = await addDoc(collection(db, this.ORDERS_COLLECTION), {
        ...orderData,
        createdAt: Timestamp.fromDate(orderData.createdAt),
      });
      return orderRef.id;
    } catch (error: any) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }
}
