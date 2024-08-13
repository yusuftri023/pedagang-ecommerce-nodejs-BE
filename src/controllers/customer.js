import { v4 as uuidv4 } from "uuid";
import {
  createAccessToken,
  createRefreshToken,
} from "../middlewares/authJWT.js";
import {
  deleteCustomerDb,
  insertCustomer,
  updatePassword,
  updatePicture,
  upsertGoogle,
  userDataByEmail,
} from "../models/customer.js";
import {
  checkBcrypt,
  hashPassword,
  hashRefreshToken,
} from "../utils/authBcrypt.js";
import "dotenv/config";
import { createSession } from "../models/session.js";
import {
  getGoogleOAuthTokens,
  getGoogleOAuthURL,
  getGoogleUser,
} from "../utils/Oauth.js";
const { SIGNED_COOKIE_SECRET, FRONT_END_DOMAIN } = process.env;

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (username && email && password) {
      const exist = (await userDataByEmail(email)) ? true : false;

      if (exist) {
        const hashedPassword = await hashPassword(password);
        await insertCustomer(username, email, hashedPassword);
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
      success: false,
      message: error.message,
      data: null,
    });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email && password) {
      const data = await userDataByEmail(email);

      if (data) {
        const {
          email: emailData,
          username: usernameData,
          id: idData,
          password: passwordData,
          picture: pictureData,
        } = data;
        const isMatch = await checkBcrypt(password, passwordData);
        if (isMatch) {
          const tokenData = {
            id: idData,
            username: usernameData,
            email: emailData,
            picture: pictureData,
          };

          const access_token = await createAccessToken(tokenData);

          const uuid = uuidv4();
          const refresh_token = await createRefreshToken({
            session_id: uuid,
            ...tokenData,
          });
          const hashedRefreshToken = await hashRefreshToken(uuid);

          await createSession(idData, hashedRefreshToken, "Web");
          return res
            .cookie("access_token", access_token, {
              signed: true,
              secure: true,
              httpOnly: true,
              secret: SIGNED_COOKIE_SECRET,
              domain: FRONT_END_DOMAIN,
              sameSite: "none",
              path: "/",
            })
            .cookie("refresh_token", refresh_token, {
              signed: true,
              secure: true,
              httpOnly: true,
              secret: SIGNED_COOKIE_SECRET,
              domain: FRONT_END_DOMAIN,
              sameSite: "none",
              path: "/",
            })
            .cookie("login_type", "Web", {
              signed: true,
              secure: true,
              httpOnly: true,
              secret: SIGNED_COOKIE_SECRET,
              domain: FRONT_END_DOMAIN,
              sameSite: "none",
              path: "/",
            })
            .status(201)
            .json({
              success: true,
              message: "Login Success",
              data: {
                access_token,
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};
export const logout = async (req, res) => {
  return res
    .clearCookie("access_token", {
      signed: true,
      secure: true,
      httpOnly: true,
      secret: SIGNED_COOKIE_SECRET,
      domain: FRONT_END_DOMAIN,
      sameSite: "none",
      path: "/",
    })
    .clearCookie("refresh_token", {
      signed: true,
      secure: true,
      httpOnly: true,
      secret: SIGNED_COOKIE_SECRET,
      domain: FRONT_END_DOMAIN,
      sameSite: "none",
      path: "/",
    })
    .clearCookie("login_type", {
      signed: true,
      secure: true,
      httpOnly: true,
      secret: SIGNED_COOKIE_SECRET,
      domain: FRONT_END_DOMAIN,
      sameSite: "none",
      path: "/",
    })
    .status(200)
    .json({
      success: true,
      message: "Logout Success",
      data: null,
    });
};
export const customer = async (req, res) => {
  const { id: idToken, email: emailToken } = req.decodedToken;

  try {
    const result = await userDataByEmail(emailToken);
    return res.status(200).json({
      success: true,
      message: "Data Fetch success",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};
export const generateGoogleLoginURL = async (req, res) => {
  const code = await getGoogleOAuthURL();
  return res.json({ url: code });
};
export const googleLogin = async (req, res) => {
  const { code } = req.query;
  try {
    const { access_token, id_token, refresh_token } =
      await getGoogleOAuthTokens({
        code,
      });
    const { id, email, verified_email, name, picture } = await getGoogleUser({
      id_token,
      access_token,
    });

    await upsertGoogle(email, verified_email, name, picture, id);
    const customerData = await userDataByEmail(email);
    const hashedRefreshToken = await hashRefreshToken(refresh_token);

    await createSession(
      Number(customerData.id),
      hashedRefreshToken,
      "Google Oauth"
    );

    res.cookie("access_token", access_token, {
      signed: true,
      secure: true,
      httpOnly: true,
      secret: SIGNED_COOKIE_SECRET,
      domain: FRONT_END_DOMAIN,
      sameSite: "none",
      path: "/",
    });
    res.cookie("refresh_token", refresh_token, {
      signed: true,
      secure: true,
      httpOnly: true,
      secret: SIGNED_COOKIE_SECRET,
      domain: FRONT_END_DOMAIN,
      sameSite: "none",
      path: "/",
    });
    res.cookie("login_type", "Google Oauth", {
      signed: true,
      secure: true,
      httpOnly: true,
      secret: SIGNED_COOKIE_SECRET,
      domain: FRONT_END_DOMAIN,
      sameSite: "none",
      path: "/",
    });
    return res.redirect(`https://${FRONT_END_DOMAIN}`);
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
export const changePicture = async (req, res) => {
  const { url } = req.uploadImage;
  const { id: idToken, email: emailToken } = req.decodedToken;
  try {
    const data = await userDataByEmail(emailToken);
    if (data) {
      await updatePicture(url, emailToken);
      return res.status(200).json({
        success: true,
        message: "Profile picture updated successfully",
        data: null,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Customer does not exist",
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
export const changepassword = async (req, res) => {
  const { id: idToken, email: emailToken } = req.decodedToken;
  const { password } = req.body;

  try {
    const data = await userDataByEmail(emailToken);

    if (data) {
      const isMatched = await checkBcrypt(password, data.password);
      if (!isMatched) {
        const hashedPassword = await hashPassword(password);
        await updatePassword(hashedPassword, data.email);
        return res.status(201).json({
          success: true,
          message: "Password updated successfully",
          data: null,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "New and old password must be different",
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

export const deleteCustomer = async (req, res) => {
  const { id: idToken, email: emailToken } = req.decodedToken;

  try {
    const data = await userDataByEmail(emailToken);
    if (data) {
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};
