import { knexConnection } from "../database/config.js";

export const findCustomerAddress = async (customerId) => {
  try {
    const result = await knexConnection
      .from("customer_address as ca")
      .join("users as u", "u.id", "ca.customer_id")
      .join("address_detail as ad", "ad.id", "ca.address_id")
      .select("ca.*", "ad.*")
      .where("ca.customer_id", customerId);

    return result.length > 0 ? result : false;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const insertCustomerAdress = async (
  customerId,
  address_line,
  city,
  region,
  postal_code,
  recipient,
  destination_id,
  selected = 0
) => {
  const trx = await knexConnection.transaction();
  try {
    const [address] = await trx("address_detail")
      .insert({
        address_line,
        city,
        region,
        postal_code,
        recipient,
        destination_id,
      })
      .returning("id");
    const addressId = address.id;
    await trx("customer_address").insert({
      customer_id: customerId,
      address_id: addressId,
      selected,
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
  postal_code,
  destination_id
) => {
  try {
    const result = await knexConnection("address_detail")
      .update({
        address_line,
        city,
        region,
        postal_code,
        destination_id,
      })
      .where("id", addressId);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const selectAddress = async (addressId, customerId) => {
  const trx = await knexConnection.transaction();
  try {
    await trx("customer_address")
      .update({
        selected: 1,
      })
      .where("address_id", addressId);
    await trx("customer_address")
      .update({ selected: 0 })
      .where("customer_id", customerId)
      .andWhereNot("address_id", addressId);
    await trx.commit();
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const deleteAddressEntry = async (addressId, customerId) => {
  try {
    await knexConnection("customer_address")
      .delete()
      .where("address_id", addressId)
      .andWhere("customer_id", customerId);
    await knexConnection("address_detail").delete().where("id", addressId);

    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};
