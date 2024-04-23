import { knexConnection } from "../database/config";
const trx = await knexConnection.transaction();
export const customerAddress = async (customerId) => {
  const result = await knexConnection
    .select("*")
    .from("customer_address as ca")
    .join("customer as c", "c.id", "ca.customer_id")
    .join("address_detail as ad", "ad.id", "ca.customer_id")
    .where("c.id", customerId);
  return result.length > 0 ? JSON.parse(JSON.stringify(result[0])) : result;
};
export const insertCustomerAdress = async (
  customerId,
  address_line,
  city,
  region,
  postal_code
) => {
  trx("address_detail")
    .insert({ address_line, city, region, postal_code }, "id")
    .then((addressId) => {
      console.log(addressId);
      trx("customer_address").insert({
        customer_id: customerId,
        address_id: addressId[0],
      });
    })
    .then(trx.commit)
    .catch(trx.rollback);
  return true;
};
export const updateAddress = async (
  addressId,
  address_line,
  city,
  region,
  postal_code
) => {
  const result = await knexConnection("address_detail")
    .update({
      address_line,
      city,
      region,
      postal_code,
    })
    .where("id", addressId);

  return result;
};
export const deleteAddress = async (id) => {
  const result = await knexConnection("address_detail")
    .delete()
    .where("id", id);

  return result;
};
