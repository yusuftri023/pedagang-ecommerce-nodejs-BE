import { knexConnection } from "../database/config.js";

export async function createSession(customerId, hashedSession, loginType) {
  try {
    if (loginType === "Web") {
      const [session] = await knexConnection("session")
        .insert({
          customer_id: customerId,
          session_id: hashedSession,
          login_type: loginType,
        })
        .onConflict("customer_id")
        .merge({ session_id: hashedSession, login_type: loginType });

      return session;
    } else if (loginType === "Google Oauth") {
      const [session] = await knexConnection("session")
        .insert({
          customer_id: customerId,
          session_id: hashedSession,
        })
        .onConflict("customer_id")
        .merge({ session_id: hashedSession, login_type: loginType });

      return session;
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
export async function findSessions(customer_id) {
  try {
    const [session] = await knexConnection
      .from("session")
      .where("customer_id", customer_id);
    return session;
  } catch (error) {
    throw new Error(error.message);
  }
}
