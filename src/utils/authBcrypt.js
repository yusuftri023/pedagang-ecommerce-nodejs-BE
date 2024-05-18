import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};
export const checkBcrypt = async (password, hashedPassword) => {
  const isMatched = await bcrypt.compare(password, hashedPassword);
  return isMatched;
};
export const hashRefreshToken = async (refereshToken) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(refereshToken, saltRounds);
  return hashedPassword;
};

export const checkRefreshToken = async (password, hashedPassword) => {
  const isMatched = await bcrypt.compare(password, hashedPassword);
  return isMatched;
};
