import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export const checkPassword = async (password, hashedPassword) => {
  const isMatched = await bcrypt.compare(password, hashedPassword);
  return isMatched;
};
