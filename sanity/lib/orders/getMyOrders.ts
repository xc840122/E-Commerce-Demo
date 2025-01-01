import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export async function getMyOrders(userId: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  // Define the query to get orders based on user ID
  const MY_ORDERS_QUERY = defineQuery(`
    *[_type == "order" && clerkUserId == $userId] | order(orderDate desc) {
      ...,
      products[]{
        ...,
        product->
      }
    }`);

  try {
    // Use sanityFetch to get data from Sanity
    const orders = await sanityFetch({
      query: MY_ORDERS_QUERY,
      params: { userId },
    });

    // return list of orders, or an empty array if there are none
    return orders.data || [];
  } catch (error) {
    console.error("Error fetching orders", error);
    return [];
  }
}
