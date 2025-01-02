import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db, auth } from "@/firebaseConfig";
import { SalesMetric } from "../types/DashboardTypes";

export class DashboardService {
  static async getDashboardData() {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");

    const now = new Date();
    const dayStart = new Date(now.setHours(0, 0, 0, 0));
    const weekStart = new Date(now.setDate(now.getDate() - 7));
    const monthStart = new Date(now.setDate(1));

    const ordersRef = collection(db, "orders");
    const querySnapshot = await getDocs(
      query(
        ordersRef,
        where("userId", "==", userId),
        where("createdAt", ">=", Timestamp.fromDate(monthStart))
      )
    );

    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    let daily = 0, weekly = 0, monthly = 0;
    orders.forEach(order => {
      const orderDate = order.createdAt.toDate();
      if (orderDate >= dayStart) daily += order.total;
      if (orderDate >= weekStart) weekly += order.total;
      monthly += order.total;
    });

    return {
      salesMetrics: { daily, weekly, monthly },
      orderMetrics: orders,
      revenueMetrics: {
        totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
        averageOrderValue: orders.reduce((sum, order) => sum + order.total, 0) / orders.length || 0,
        orderCount: orders.length
      }
    };
  }
}