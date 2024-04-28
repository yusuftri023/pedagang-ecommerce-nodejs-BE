import { knexConnection, pool } from "../database/config.js";

export const checkWishlist = async (customerId, productId) => {
  try {
    const result = await knexConnection
      .from("wishlist")
      .where("customer_id", customerId)
      .andWhere("product_id", productId);

    return result.length > 0 ? true : false;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const wishlistData = async (customerId, wishlistId) => {
  try {
    const result = await knexConnection
      .from("wishlist")
      .where("id", wishlistId)
      .andWhere("customer_id", customerId);

    return result.length > 0 ? true : false;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const wishlistItems = async (customerId, page = 1, limit = 10) => {
  try {
    const result = await knexConnection
      .from("wishlist")
      .where("customer_id", customerId)
      .offset((page - 1) * limit)
      .limit(limit);
    return result.length > 0 ? JSON.parse(JSON.stringify(result)) : result;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const insertWishlist = async (customer_id, product_id) => {
  try {
    const [result] = await knexConnection("wishlist").insert([
      {
        customer_id,
        product_id,
      },
    ]);
    console.log(result);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteWishlistEntry = async (id) => {
  try {
    await knexConnection("wishlist").delete().where("id", id);

    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};
