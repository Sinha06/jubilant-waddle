import Sha1 from 'sha1';
import { genSalt, hash } from 'bcrypt'
export const encodeSha1 = (password) => {
  if (!password) {
    throw new Error("password cannot be null");
  }
  password = new Buffer(Sha1(password));
  const based64Password = password.toString("base64");
  return based64Password;
};

export const generateSalt = () => {
  return genSalt();
};

export const encode = (password, salt) => {
  return hash(password, salt)
};