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
} = process.env;
export const createAccessToken = async (userData) => {
  const token = jwt.sign(userData, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: 15,
  });
  return token;
};
export const createRefreshToken = async (uuid) => {
  const token = jwt.sign(uuid, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: 30,
  });

  return token;
};

export const auth = async (req, res, next) => {
  const { access_token, refresh_token, login_type } = req.signedCookies;
  console.log(access_token);
  console.log(refresh_token);
  console.log(login_type);
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
              console.log(decodedRefresh);
              const hashedSession = await findSessions(decodedRefresh.id);
              console.log(hashedSession);
              const isMatched = await checkBcrypt(
                decodedRefresh.session_id,
                hashedSession.session_id
              );
              if (isMatched) {
                const newAccessToken = await createAccessToken({
                  username: decodedRefresh.username,
                  id: decodedRefresh.id,
                  email: decodedRefresh.email,
                });
                console.log("newaccesstoken", newAccessToken);
                req.decodedToken = decodedRefresh;
                res.cookie("access_token", newAccessToken, {
                  signed: true,
                  secure: true,
                  httpOnly: true,
                  secret: SIGNED_COOKIE_SECRET,
                  domain: "127.0.0.1",
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
    console.log(accessResponse);
    if (accessResponse === "invalid_token") {
      const refreshResponse = await getAccessWithRefreshToken({
        refresh_token,
      });
      console.log(refreshResponse);
      const newAccessResponse = await authorizeOAuthAccess({
        access_token: refreshResponse.access_token,
      });

      const { id, username, email } = await userDataByEmail(
        newAccessResponse.email
      );

      req.decodedToken = { id, username, email };
      console.log("lewat sini 2");
      res.cookie("access_token", refreshResponse.access_token, {
        signed: true,
        secure: true,
        httpOnly: true,
        secret: SIGNED_COOKIE_SECRET,
        domain: "127.0.0.1",
        sameSite: "none",
        path: "/",
      });
      return next();
    }
    console.log("lewat sini");
    const { id, username, email } = await userDataByEmail(accessResponse.email);

    req.decodedToken = { id, username, email };
    next();
  }
};
