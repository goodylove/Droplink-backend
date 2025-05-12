import bcryptjs from "bcryptjs";

export async function hashPassword(password: string) {
  const salt = await bcryptjs.genSalt(10);
  const hashUserPassword = await bcryptjs.hash(password, salt);
  return hashUserPassword;
}

export async function comparePassword(password: string, hashPassword: string) {
  const isMatch = await bcryptjs.compare(password, hashPassword);
  return isMatch;
}
