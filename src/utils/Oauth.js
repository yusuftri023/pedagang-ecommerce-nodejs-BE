import axios from "axios";
import qs from "qs";
import "dotenv/config";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL,
  FRONT_END_DOMAIN,
} = process.env;
export async function getGoogleOAuthURL() {
  const url = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: GOOGLE_REDIRECT_URL,
    client_id: GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };
  const qs = new URLSearchParams(options);

  return `${url}?${qs.toString()}`;
}

export async function getGoogleOAuthTokens({ code }) {
  const url = "https://oauth2.googleapis.com/token";

  const values = {
    grant_type: "authorization_code",
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: `https://${FRONT_END_DOMAIN}:8080/auth/google/callback`,
  };

  try {
    const res = await axios.post(url, qs.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return res.data;
  } catch (error) {
    console.log("Failed to fetch Google Oauth Tokens");
    return error.response.data.error;
  }
}
export async function authorizeOAuthAccess({ access_token }) {
  const values = {
    access_token,
  };
  const qs = new URLSearchParams(values);
  const url = `https://oauth2.googleapis.com/tokeninfo?${qs.toString()}`;

  try {
    const res = await axios.get(url);

    return res.data;
  } catch (error) {
    console.log("Failed to fetch Google Oauth Access Tokens");
    return error.response.data.error;
  }
}
export async function getAccessWithRefreshToken({ refresh_token }) {
  const url = "https://oauth2.googleapis.com/token";

  const values = {
    grant_type: "refresh_token",
    refresh_token,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
  };

  try {
    const res = await axios.post(url, qs.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return res.data;
  } catch (error) {
    console.log("Failed to fetch Google Oauth Refresh Tokens");
    return error.response.data.error;
  }
}

export async function getGoogleUser({ id_token, access_token }) {
  try {
    const res = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log("Error fetching Google user");
    return error.response.data.error;
  }
}

// export async function findAndUpdateUser(query, update, options) {
//   return UserModel.findOneAndUpdate(query, update, options);
// }

// export async function reIssueAccessToken({ refreshToken }) {
//   const { decoded } = verifyJwt(refreshToken);

//   if (!decoded || !decoded.session) return false;

//   const session = await SessionModel.findById(decoded.session);

//   if (!session || !session.valid) return false;

//   const user = await findUser({ _id: session.user });

//   if (!user) return false;

//   const accessToken = JWTsign(
//     { ...user, session: session._id },
//     { expiresIn: config.get("accessTokenTtl") } // 15 minutes
//   );

//   return accessToken;
// }
