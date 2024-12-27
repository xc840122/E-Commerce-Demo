import { defineQuery } from "next-sanity"
import { sanityFetch } from "../live";

export const getProductBySlug = async (slug: string) => {
  const PRODUCT_BY_SLUG = defineQuery(`
    *[
      _type == "product" && slug.current == $slug
    ] | order(name asc)[0]
  `);

  try {
    // Use sanityFetch to get data from Sanity
    const product = await sanityFetch({
      query: PRODUCT_BY_SLUG,
      params: {
        slug,
      }
    });
    // return list of products, or an empty array if there are none
    return product.data || null;
  } catch (error) {
    console.error("Error fetching product by ID", error);
    return null;
  }
}