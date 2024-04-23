import { knexConnection, pool } from "../database/config.js";

export const wishlistData = async (customerId) => {
  const result = await knexConnection
    .from("wishlist")
    .where("customer_id", customerId);
  return result.length > 0 ? JSON.parse(JSON.stringify(result[0])) : result;
};
export const insertWishlist = async (customer_id, product_id) => {
  const [result] = await knexConnection("cart").insert([
    {
      customer_id,
      product_id,
    },
  ]);
  return result;
};

export const deleteWishlistEntry = async (id) => {
  const result = await knexConnection("wishlist").delete().where("id", id);

  return result;
};
