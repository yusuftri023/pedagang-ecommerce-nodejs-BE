import { knexConnection, pool } from "../database/config.js";

export const showCategory = async (page = 1, limit = 10) => {
  try {
    const result = await knexConnection
      .from("category")
      .offset((page - 1) * limit)
      .limit(limit);

    return result.length > 0 ? JSON.parse(JSON.stringify(result)) : false;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const insertCategory = async (name, description = "-") => {
  try {
    const [result] = await knexConnection("category").insert([
      { name, description },
    ]);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
