import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

// Function to get all categories from Sanity
export const getAllCategories = async () => {
  const ALL_CATEGORIES_QUERY = defineQuery(`
    *[_type=="category"] | order(title asc)`);

  try {
    // Use sanityFetch to get data from Sanity
    const categories = await sanityFetch({
      query: ALL_CATEGORIES_QUERY,
    });

    // return list of products, or an empty array if there are none
    return categories.data || [];
  } catch (error) {
    console.error("Error fetching categories", error);
    return [];
  }
}