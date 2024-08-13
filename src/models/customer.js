import { knexConnection } from "../database/config.js";

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
  password,
  phone_number = "-",
  picture = "https://ik.imagekit.io/neuros123/default-profile-pic.png"
) => {
  try {
    const result = await knexConnection("customer").insert([
      {
        username,
        email,
        password,
        phone_number,
        picture,
      },
    ]);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const upsertGoogle = async (
  email,
  verified_email,
  name,
  picture,
  google_id
) => {
  try {
    verified_email = verified_email === true ? 1 : 0;
    const result = await knexConnection("customer")
      .insert({
        email,
        verified: verified_email,
        username: name,
        picture,
        google_id,
        password: "defaultnopassword",
        phone_number: "-",
      })
      .onConflict("email")
      .merge({ google_id, verified: verified_email });
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
    await knexConnection("customer")
      .update({
        picture,
      })
      .where("email", email);

    return true;
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
