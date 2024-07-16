import { knexConnection } from "../database/config.js";

export const showSearchProduct = async (keyword) => {
  try {
    console.log(keyword);
    const result = await knexConnection
      .from("product as p")
      .select(
        "p.*",
        "ca.name as category_name",
        "pc.*",
        "vo.value as variation_value",
        "v.name as variation_name"
      )

      .join("product_config as pc", "pc.product_id", "p.id")
      .join("variation_option as vo", "vo.id", "pc.variation_option_id")
      .join("variation as v", "v.id", "vo.variation_id")
      .join("category as ca", "ca.id", "p.category_id")
      .where("p.title", "like", `%${keyword}%`);

    console.log(result);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const showAllProduct = async () => {
  try {
    const result = await knexConnection
      .from("product as p")
      .join("product_config as pc", "pc.product_id", "p.id");

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
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
export const showDetailProductVariation = async (productId, variationId) => {
  try {
    let result;
    if (variationId === "null") {
      result = await knexConnection
        .from("product as p")
        .join("product_config as pc", "pc.product_id", "p.id")
        .where("pc.product_id", productId)
        .andWhere("pc.variation_option_id", null);
    } else {
      result = await knexConnection

        .from("product as p")
        .join("product_config as pc", "pc.product_id", "p.id")
        .join("variation_option as vo", "vo.id", "pc.variation_option_id")
        .join("variation as v", "v.id", "vo.variation_id")
        .where("pc.product_id", productId)
        .andWhere("pc.variation_option_id", variationId)
        .select(
          "p.*",
          "pc.*",
          "vo.id",
          "vo.value as variation_value",
          "v.name as variation_name"
        );
    }

    return result[0];
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
