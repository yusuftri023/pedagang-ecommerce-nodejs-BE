import { createAccessToken, createRefreshToken } from "../middlewares/authJWT";
import { userDataByEmail } from "../models/customer";
import { createSession } from "../models/session";
import { checkBcrypt, hashRefreshToken } from "../utils/authBcrypt";
import { v4 as uuidv4 } from "uuid";
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
          role,
        } = data;
        const isAdmin = role === "admin";
        const isMatch = await checkBcrypt(password, passwordData);
        if (isMatch && isAdmin) {
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
              domain: "pedagang-ecommerce.site",
              sameSite: "none",
              path: "/",
            })
            .cookie("refresh_token", refresh_token, {
              signed: true,
              secure: true,
              httpOnly: true,
              secret: SIGNED_COOKIE_SECRET,
              domain: "pedagang-ecommerce.site",
              sameSite: "none",
              path: "/",
            })
            .cookie("login_type", "Web", {
              signed: true,
              secure: true,
              httpOnly: true,
              secret: SIGNED_COOKIE_SECRET,
              domain: "pedagang-ecommerce.site",
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
