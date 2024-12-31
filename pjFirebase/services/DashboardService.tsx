export class DashboardService {
  static async getDashboardData(): Promise<DashboardData> {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");

    const ordersRef = collection(db, "orders");
    const querySnapshot = await getDocs(
      query(ordersRef, where("userId", "==", userId))
    );

    const orders = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    return {
      salesMetrics: await MetricsService.getSalesMetrics(),
      orderMetrics: orders,
      revenueMetrics: {
        totalRevenue,
        averageOrderValue: totalRevenue / orders.length || 0,
        orderCount: orders.length,
      },
    };
  }
}
