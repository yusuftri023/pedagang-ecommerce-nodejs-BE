import { knexConnection } from "../database/config.js";

export const findCustomerAddress = async (customerId) => {
  try {
    const result = await knexConnection
      .from("customer_address as ca")
      .join("customer as c", "c.id", "ca.customer_id")
      .join("address_detail as ad", "ad.id", "ca.customer_id")
      .where("c.id", customerId);
    return result.length > 0 ? JSON.parse(JSON.stringify(result[0])) : result;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const insertCustomerAdress = async (
  customerId,
  address_line,
  city,
  region,
  postal_code
) => {
  try {
    const trx = await knexConnection.transaction();
    const [addressId] = await trx("address_detail").insert(
      { address_line, city, region, postal_code },
      "id"
    );
    await trx("customer_address").insert({
      customer_id: customerId,
      address_id: addressId,
    });
    await trx.commit();
    return true;
  } catch (error) {
    trx.rollback();
    throw new Error(error.message);
  }
};
export const updateAddress = async (
  addressId,
  address_line,
  city,
  region,
  postal_code
) => {
  try {
    const result = await knexConnection("address_detail")
      .update({
        address_line,
        city,
        region,
        postal_code,
      })
      .where("id", addressId);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const selectAddress = async (addressId, customerId) => {
  try {
    const result = await knexConnection("customer_address")
      .update({
        selected: true,
      })
      .where("address_id", addressId);
    await knexConnection("customer_address")
      .update({ selected: false })
      .where("customer_id", customerId)
      .andWhereNot("address_id", addressId);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const deleteAddressEntry = async (id) => {
  try {
    await knexConnection("customer_address").delete().where("address_id", id);
    await knexConnection("address_detail").delete().where("id", id);

    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};
