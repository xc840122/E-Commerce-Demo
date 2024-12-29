import { defineQuery } from "next-sanity"
import { sanityFetch } from "../live";

export const getProductsByCategory = async (categorySlug: string) => {
  const PRODUCTS_BY_CATEGORY = defineQuery(`
    *[
      _type == "product"
      && references(*[_type=="category" && slug.current == $categorySlug]._id)
    ] | order(name asc)
  `);

  try {
    // Use sanityFetch to get data from Sanity
    const product = await sanityFetch({
      query: PRODUCTS_BY_CATEGORY,
      params: {
        categorySlug,
      }
    });
    // return list of products, or an empty array if there are none
    return product.data || [];
  } catch (error) {
    console.error("Error fetching product by category", error);
    return [];
  }
}