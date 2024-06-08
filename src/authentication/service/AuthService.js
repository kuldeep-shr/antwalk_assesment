import { createUser, findUser } from "../model/User.js";
import { createMagicLink, createJWTToken } from "../../middlewares/Common.js";

const createUserService = async (args) => {
  try {
    // validate email first
    const isUserExists = await findUser({ email: args.email });
    if (isUserExists) {
      return {
        isError: true,
        message: "user already exists",
      };
    }
    const getMagicLink = await createMagicLink({ email: args.email });
    const saveUser = await createUser({
      name: args.name,
      email: args.email,
      magic_link_token: getMagicLink.magic_link_token,
      magic_link_expires: getMagicLink.magic_link_expires,
    });
    saveUser.magic_link_token = getMagicLink.magic_link_url;
    return {
      isError: false,
      message: "user created successfully",
      data: saveUser,
    };
  } catch (error) {
    return {
      isError: true,
      message: "something went wrong, while user creating",
      data: [],
    };
  }
};

const userLogin = async (args) => {
  try {
    const isUserExists = await findUser({ email: args.email });
    if (!isUserExists) {
      return {
        isError: true,
        message: "user not exists,please register with us",
      };
    }
  } catch (error) {}
};
export { createUserService };
