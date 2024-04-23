import { knexConnection, pool } from "../database/config.js";

export const userData = async (email) => {
  const result = await knexConnection.from("customer").where("email", email);
  return result.length > 0 ? JSON.parse(JSON.stringify(result[0])) : result;
};
export const insertCustomer = async (
  username,
  email,
  phone_number,
  password
) => {
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
};
export const updatePassword = async (password, email) => {
  const result = await knexConnection("customer")
    .update({
      password,
      last_password_update: new Date(),
    })
    .where("email", email);

  return result;
};
export const updatePicture = async (picture, email) => {
  const result = await knexConnection("customer")
    .update({
      picture,
    })
    .where("email", email);

  return result;
};
export const deleteCustomerDb = async (id) => {
  const result = await knexConnection("customer").delete().where("id", id);

  return result;
};
