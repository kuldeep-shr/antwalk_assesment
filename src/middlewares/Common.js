/*
	common middlewares are;
	1) magic link creation
	2) token creation
	3) token validation
*/

import crypto from "crypto";
import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/ApiResponse.js";
// import moment from "momentjs";

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
    const magicLink = `http://localhost:8000/api/auth/validate?email=${args.email}&link=${getLink}`;
    console.log("magicLink", magicLink);
    const expiresTime = new Date(Date.now() + 15 * 60 * 1000);
    return {
      magic_link_url: magicLink,
      magic_link_token: getLink,
      magic_link_expires: expiresTime,
    };
  } catch (error) {
    throw "something went wrong, while creating the magic link";
  }
};

const createJWTToken = (args, expiresIn = "24h") => {
  try {
    return jwt.sign(args, process.env.SECRET_KEY, { expiresIn });
  } catch (error) {
    throw "something went wrong, while creating the jwt token";
  }
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return errorResponse("No token provided", 400);
  }
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse("Invalid token", 400);
  }
};

export { createMagicLink, createJWTToken, verifyToken };
