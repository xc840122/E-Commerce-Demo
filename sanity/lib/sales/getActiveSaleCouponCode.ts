import { defineQuery } from "next-sanity";
import { CouponCode } from "./couponCodes";
import { sanityFetch } from "../live";

export const getActiveSaleCouponCode = async (couponCode: CouponCode) => {
  const ACTIVE_SALE_COUPON_QUERY = defineQuery(`
    *[
      _type == "sale"
      && isActive == true 
      && couponCode == $couponCode
    ] | order(validFrom desc) [0]
    `);

  try {
    const activeSale = await sanityFetch({
      query: ACTIVE_SALE_COUPON_QUERY,
      // pass couponCode as a variable to the query
      params: { couponCode },
    });

    return activeSale ? activeSale.data : null;
  } catch (error) {
    console.error("Error fetching active sale coupon", error);
    return null;
  }
}