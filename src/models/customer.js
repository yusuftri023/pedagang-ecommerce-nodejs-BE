import { knexConnection } from "../database/config.js";

export const userDataByEmail = async (email) => {
  try {
    const result = await knexConnection
      .select("u.*", "r.name as role")
      .from("users as u")
      .join("user_role as ur", "ur.user_id", "u.id")
      .join("role as r", "ur.role_id", "r.id")
      .where("email", email);
    return result[0];
  } catch (error) {
    throw new Error(error.message);
  }
};
export const userDataById = async (id) => {
  try {
    const result = await knexConnection
      .select("u.*", "r.name as role")
      .join("user_role as ur", "ur.user_id", "u.id")
      .join("role as r", "ur.role_id", "r.id")
      .from("users as u")
      .where("u.id", id);
    return result[0];
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
    const result = await knexConnection("users").insert([
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
    const result = await knexConnection("users")
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
export const updateUserProfile = async (
  user_id,
  email,
  phone_number,
  username,
  verified
) => {
  try {
    const result = await knexConnection("users")
      .update({
        username,
        email,
        phone_number,
        verified,
      })
      .where("id", user_id);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const updatePassword = async (password, email) => {
  try {
    const result = await knexConnection("users")
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
    await knexConnection("users")
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
    const result = await knexConnection("users").delete().where("id", id);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
