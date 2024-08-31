import {
  deleteAddressEntry,
  findCustomerAddress,
  insertCustomerAdress,
  selectAddress,
  updateAddress,
} from "../models/address.js";

export const customerAddress = async (req, res) => {
  const { id: customerId } = req.decodedToken;

  try {
    const result = await findCustomerAddress(customerId);
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Data Fetch success",
        data: result,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Customer address is empty",
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

export const addCustomerAddress = async (req, res) => {
  const { id: customerId } = req.decodedToken;
  const { address_line, city, region, postal_code, recipient, destination_id } =
    req.body;
  try {
    if (
      address_line &&
      city &&
      region &&
      postal_code &&
      recipient &&
      destination_id
    ) {
      await insertCustomerAdress(
        customerId,
        address_line,
        city,
        region,
        postal_code,
        recipient,
        destination_id
      );
      return res.status(201).json({
        success: true,
        message: "Address successfully created",
        data: null,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Request is not complete ",
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

export const changeAddressDetails = async (req, res) => {
  const { address_line, city, region, postal_code, destination_id } = req.body;
  const { addressId } = req.params;
  try {
    if (
      address_line &&
      city &&
      region &&
      postal_code &&
      addressId &&
      destination_id
    ) {
      await updateAddress(
        addressId,
        address_line,
        city,
        region,
        postal_code,
        destination_id
      );
      return res.status(201).json({
        success: true,
        message: "Address successfully updated",
        data: null,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Request is not complete ",
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
export const changeSelectedAddress = async (req, res) => {
  const { id: customerId } = req.decodedToken;
  const { addressId } = req.params;
  try {
    if (addressId) {
      await selectAddress(addressId, customerId);
      return res.status(200).json({
        success: true,
        message: "Address successfully changed",
        data: null,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Request is not complete ",
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
export const deleteAddress = async (req, res) => {
  const { id: customerId } = req.decodedToken;
  const { addressId } = req.params;
  try {
    const data = await findCustomerAddress(customerId);

    if (data.length > 0) {
      await deleteAddressEntry(addressId, customerId);
      return res.status(200).json({
        success: true,
        message: "Address entry deleted",
        data: null,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Address entry does not exist",
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
