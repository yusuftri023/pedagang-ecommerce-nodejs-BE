import { shipmentDetail } from "../models/shipment.js";

export const customerShipment = async (req, res) => {
  const { id: customerId } = req.decodedToken;
  const { shipmentId } = req.params;
  try {
    const result = await shipmentDetail(shipmentId, customerId);
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Data Fetch success",
        data: result,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Shipment does not exist",
        data: null,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};
