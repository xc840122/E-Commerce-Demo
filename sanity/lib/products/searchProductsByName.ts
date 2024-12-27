import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const searchProductsByName = async (searchParam: string) => {

  const PRODUCT_SEARCH_QUERY = defineQuery(`
    *[
      _type == "product" 
      && name match $searchParam
      ] | order(name asc)
  `);

  try {
    // Use sanityFetch to get data from Sanity
    const products = await sanityFetch({
      query: PRODUCT_SEARCH_QUERY,
      params: {
        searchParam,
      }
    });

    // return list of products, or an empty array if there are none
    return products.data || [];
  } catch (error) {
    console.error("Error fetching products", error);
    return [];
  }
};