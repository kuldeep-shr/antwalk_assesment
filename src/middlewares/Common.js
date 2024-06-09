/*
	common middlewares are;
	1) magic link creation
	2) token creation
	3) token validation
*/

import crypto from "crypto";
import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/ApiResponse.js";
const { SECRET_KEY, MAGIC_LINK_URL } = process.env;

const generateToken = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(20, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer.toString("hex"));
      }
    });
  });
};

const createMagicLink = async (args) => {
  try {
    const getLink = await generateToken();
    const magicLink = `${MAGIC_LINK_URL}?email=${args.email}&link=${getLink}`;
    const expiresTime = new Date(Date.now() + 5 * 60 * 1000);
    return {
      link: getLink,
      magic_link_url: magicLink,
      magic_link_expires: expiresTime,
    };
  } catch (error) {
    throw "something went wrong, while creating the magic link";
  }
};

const createJWTToken = (args, expiresIn = "24h") => {
  try {
    return jwt.sign(args, SECRET_KEY, { expiresIn });
  } catch (error) {
    throw "something went wrong, while creating the jwt token";
  }
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json(errorResponse("No token provided", 400));
  }
  try {
    const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json(errorResponse("Invalid token", 400));
  }
};

export { createMagicLink, createJWTToken, verifyToken };
