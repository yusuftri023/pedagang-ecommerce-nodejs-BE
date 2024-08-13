import jwt from "jsonwebtoken";
import { userDataByEmail } from "../models/customer.js";
import {
  authorizeOAuthAccess,
  getAccessWithRefreshToken,
} from "../utils/Oauth.js";
import { checkBcrypt } from "../utils/authBcrypt.js";
import { findSessions } from "../models/session.js";

const {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
  SIGNED_COOKIE_SECRET,
  FRONT_END_DOMAIN,
} = process.env;
export const createAccessToken = async (userData) => {
  const token = jwt.sign(userData, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: 3600,
  });
  return token;
};
export const createRefreshToken = async (uuid) => {
  const token = jwt.sign(uuid, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return token;
};

export const auth = async (req, res, next) => {
  const { access_token, refresh_token, login_type } = req.signedCookies;

  if (!access_token) {
    return res.status(401).json({
      success: false,
      message:
        "No authorization cookies detected, you're not authorized to access this page!",
      data: null,
    });
  } else if (login_type === "Web") {
    jwt.verify(access_token, JWT_ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err?.message === "jwt expired") {
        jwt.verify(
          refresh_token,
          JWT_REFRESH_TOKEN_SECRET,
          async (err, decodedRefresh) => {
            if (err) {
              return res.status(401).json({
                success: false,
                message:
                  "Invalid refresh token, you're not authorized to access this page!",
                err: err.message,
                data: null,
              });
            } else {
              const hashedSession = await findSessions(decodedRefresh.id);

              const isMatched = await checkBcrypt(
                decodedRefresh.session_id,
                hashedSession.session_id
              );
              if (isMatched) {
                const newAccessToken = await createAccessToken({
                  username: decodedRefresh.username,
                  id: decodedRefresh.id,
                  email: decodedRefresh.email,
                  picture: decodedRefresh.picture,
                });
                req.decodedToken = decodedRefresh;
                res.cookie("access_token", newAccessToken, {
                  signed: true,
                  secure: true,
                  httpOnly: true,
                  secret: SIGNED_COOKIE_SECRET,
                  domain: "onrender.com",
                  sameSite: "none",
                  path: "/",
                });
                next();
              }
            }
          }
        );
      } else if (err) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid access token, you're not authorized to access this page!",
          err: err.message,
          data: null,
        });
      } else {
        req.decodedToken = decoded;
        next();
      }
    });
  } else if (login_type === "Google Oauth") {
    const accessResponse = await authorizeOAuthAccess({
      access_token,
    });
    if (accessResponse === "invalid_token") {
      const refreshResponse = await getAccessWithRefreshToken({
        refresh_token,
      });
      const newAccessResponse = await authorizeOAuthAccess({
        access_token: refreshResponse.access_token,
      });

      const { id, username, email, picture } = await userDataByEmail(
        newAccessResponse.email
      );

      req.decodedToken = { id, username, email, picture };

      res.cookie("access_token", refreshResponse.access_token, {
        signed: true,
        secure: true,
        httpOnly: true,
        secret: SIGNED_COOKIE_SECRET,
        domain: "onrender.com",
        sameSite: "none",
        path: "/",
      });
      return next();
    }
    const { id, username, email, picture } = await userDataByEmail(
      accessResponse.email
    );

    req.decodedToken = { id, username, email, picture };
    next();
  }
};
