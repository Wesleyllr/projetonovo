import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "@/firebaseConfig";
import { ICartItem, IOrder } from "@/types/types";

export class OrderService {
  private static ORDERS_COLLECTION = "orders";

  static async createOrder(
    items: ICartItem[],
    total: number,
    status: "completed" | "pending" | "canceled"
  ): Promise<string> {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");

    const orderData: Omit<IOrder, "id"> = {
      userId,
      items,
      total,
      status,
      createdAt: new Date(),
    };

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