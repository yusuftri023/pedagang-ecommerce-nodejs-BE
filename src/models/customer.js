import { knexConnection, pool } from "../database/config.js";

export const userDataByEmail = async (email) => {
  try {
    const result = await knexConnection.from("customer").where("email", email);
    return result.length > 0 ? JSON.parse(JSON.stringify(result[0])) : result;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const insertCustomer = async (
  username,
  email,
  phone_number,
  password
) => {
  try {
    const defaultPicture =
      "https://ik.imagekit.io/neuros123/default-profile-pic.png";
    const [result] = await knexConnection("customer").insert([
      {
        username,
        email,
        phone_number,
        password,
        picture: defaultPicture,
      },
    ]);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const updatePassword = async (password, email) => {
  try {
    const result = await knexConnection("customer")
      .update({
        password,
        last_password_update: new Date(),
      })
      .where("email", email);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const updatePicture = async (picture, email) => {
  try {
    const result = await knexConnection("customer")
      .update({
        picture,
      })
      .where("email", email);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const deleteCustomerDb = async (id) => {
  try {
    const result = await knexConnection("customer").delete().where("id", id);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
