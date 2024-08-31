import axios from "axios";
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

export const province = async (req, res) => {
  try {
    const result = await axios
      .get("https://api.rajaongkir.com/starter/province", {
        headers: {
          key: "fc047c1ff364a797b715979366c0c960",
        },
      })
      .then((res) => res.data.rajaongkir.results);

    return res
      .status(200)
      .json({ success: true, message: "success", data: result });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};
export const city = async (req, res) => {
  try {
    const { province_id } = req.query;
    const result = await axios
      .get(`https://api.rajaongkir.com/starter/city?province=${province_id}`, {
        headers: {
          key: "fc047c1ff364a797b715979366c0c960",
        },
      })
      .then((res) => res.data.rajaongkir.results);

    return res
      .status(200)
      .json({ success: true, message: "success", data: result });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};
export const shipmentCost = async (req, res) => {
  try {
    const { destination_id, weight, courier } = req.body;
    const data = {
      origin: "387",
      destination: destination_id,
      weight,
      courier,
    };
    const result = await axios
      .post(`https://api.rajaongkir.com/starter/cost`, data, {
        headers: {
          key: "fc047c1ff364a797b715979366c0c960",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => res.data.rajaongkir.results)
      .catch((err) => {
        throw new Error(err.message);
      });
    return res
      .status(200)
      .json({ success: true, message: "success", data: result });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};
