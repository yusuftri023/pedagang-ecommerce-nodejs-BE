import { knexConnection, pool } from "../database/config.js";

export const checkWishlist = async (customerId, productId) => {
  const result = await knexConnection
    .from("wishlist")
    .where("customer_id", customerId)
    .andWhere("product_id", productId);
  return result.length > 0 ? true : false;
};
export const wishlistData = async (customerId, wishlistId) => {
  const result = await knexConnection
    .from("wishlist")
    .where("id", wishlistId)
    .andWhere("customer_id", customerId);

  return result.length > 0 ? JSON.parse(JSON.stringify(result[0])) : result;
};
export const wishlistItems = async (customerId, page = 1, limit = 10) => {
  const result = await knexConnection
    .from("wishlist")
    .where("customer_id", customerId)
    .offset((page - 1) * limit)
    .limit(limit);
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
