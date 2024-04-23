import { JWTsign } from "../middlewares/authJWT.js";
import {
  deleteCustomerDb,
  insertCustomer,
  updatePassword,
  updatePicture,
  userData,
} from "../models/customer.js";
import { checkPassword, hashPassword } from "../utils/authBcrypt.js";
import "dotenv/config";
const { SIGNED_COOKIE_SECRET } = process.env;

export const register = async (req, res) => {
  const { username, email, phone_number, password } = req.body;
  try {
    if (username && email && password && phone_number) {
      const exist = (await userData(email)) ? true : false;

      if (exist) {
        const hashedPassword = await hashPassword(password);
        await insertCustomer(username, email, phone_number, hashedPassword);
        return res.status(201).json({
          success: true,
          message: "Account successfully created",
          data: null,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Email already exist",
          data: null,
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Request is not complete ",
        data: null,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    const data = await userData(email);
    if (data) {
      const {
        email: emailData,
        username: usernameData,
        id: idData,
        password: passwordData,
      } = data;
      const isMatch = await checkPassword(password, passwordData);
      if (isMatch) {
        const tokenData = {
          id: idData,
          username: usernameData,
          email: emailData,
        };
        const token = await JWTsign(tokenData);
        return res
          .cookie("authorization", token, {
            signed: true,
            secure: true,
            httpOnly: true,
            secret: SIGNED_COOKIE_SECRET,
          })
          .status(201)
          .json({
            success: true,
            message: "Login Success",
            data: {
              token,
            },
          });
      } else {
        return res.status(400).json({
          success: false,
          message: "email or password is invalid",
          data: null,
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: "Customer does not exist",
        data: null,
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Request is not complete ",
      data: null,
    });
  }
};

export const customer = async (req, res) => {
  const { id } = req.params;
  const { id: idToken, email: emailToken } = req.decodedToken;

  if (Number(id) === Number(idToken)) {
    const result = await userData(emailToken);
    return res.status(200).json({
      success: true,
      message: "Data Fetch success",
      data: result,
    });
  } else {
    return res.status(403).json({
      success: false,
      message: "Can't access this data",
      data: null,
    });
  }
};

export const changePicture = async (req, res) => {
  const { url } = req.uploadImage;
  const { id } = req.params;
  const { id: idToken, email: emailToken } = req.decodedToken;
  const data = await userData(emailToken);
  if (Number(id) === Number(idToken) && data) {
    const result = await updatePicture(url, emailToken);
    return res.status(200).json({
      success: true,
      message: "Data updated successfully",
      data: result,
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "Customer does not exist",
      data: null,
    });
  }
};
export const changepassword = async (req, res) => {
  const { id: idToken, email: emailToken } = req.decodedToken;
  const { password } = req.body;
  const { id } = req.params;
  const data = await userData(emailToken);

  if (Number(id) === Number(idToken) && data) {
    const isMatched = await checkPassword(password, data.password);
    if (!isMatched) {
      const hashedPassword = await hashPassword(password);
      const result = await updatePassword(hashedPassword, data.email);
      return res.status(201).json({
        success: true,
        message: "Password updated successfully",
        data: result,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "New and old password must be different",
        data: null,
      });
    }
  } else {
    if (Number(id) !== Number(idToken)) {
      return res.status(400).json({
        success: false,
        message: "Bad request id",
        data: null,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Customer does not exist",
        data: null,
      });
    }
  }
};

export const deleteCustomer = async (req, res) => {
  const { id: idToken, email: emailToken } = req.decodedToken;
  const { id } = req.params;
  const data = await userData(emailToken);
  if (Number(id) === Number(idToken) && data) {
    await deleteCustomerDb(idToken);
    return res.status(200).json({
      success: true,
      message: "Account deleted",
      data: null,
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "Customer does not exist",
      data: null,
    });
  }
};
