import { knexConnection } from "../database/config.js";

export const showDetailProduct = async (productId) => {
  try {
    const result = await knexConnection
      .from("product as p")
      .join("product_config as pc", "pc.product_id", "p.id")
      .where("pc.product_id", productId);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const insertProduct = async (
  title,
  price,
  stock,
  categoryId,
  configs,
  image = "https://ik.imagekit.io/neuros123/product-placeholder-wp.jpg",
  description = "-"
) => {
  try {
    const trx = await knexConnection.transaction();

    const [productId] = await trx("product").insert([
      { title, description, price, stock, image, category_id: categoryId },
    ]);
    const product_config =
      configs.length > 0
        ? configs.map((config) => {
            return { product_id: productId, variation_option_id: config };
          })
        : { product_id: productId, variation_option_id: null };
    await trx("product_config").insert(product_config);
    await trx.commit();
    return true;
  } catch (error) {
    await trx.rollback();
    throw new Error(error.message);
  }
};
export const deleteProductEntry = async (productId) => {
  try {
    await knexConnection("product").delete().where("id", productId);
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};
