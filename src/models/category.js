import { knexConnection } from "../database/config.js";

export const showCategory = async () => {
  try {
    const result = await knexConnection.from("category");

    return result.length > 0 ? result : false;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const insertCategory = async (name, description = "-") => {
  try {
    const result = await knexConnection("category").insert([
      { name, description },
    ]);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
