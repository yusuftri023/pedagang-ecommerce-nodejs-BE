import { knexConnection } from "../database/config.js";

export const shipmentDetail = async (shipmentId, customerId) => {
  try {
    const result = await knexConnection
      .select("s.shipment_date as shipment_date", "ad.*")
      .from("shipment as s")
      .join("address_detail as ad", "ad.id", "s.address_id")
      .where("s.customer_id", customerId)
      .andWhere("s.id", shipmentId);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
