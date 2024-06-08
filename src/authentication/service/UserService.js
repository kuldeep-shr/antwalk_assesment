import UserModel from "../model/User.js";
import { createJWTToken, createMagicLink } from "../../middlewares/Common.js";

const createUserService = async (args) => {
  try {
    // validate email first
    const isUserExists = await UserModel.findUser({ email: args.email });
    if (isUserExists) {
      return {
        isError: true,
        message: "user already exists",
      };
    }
    const getMagicLink = await createMagicLink({
      email: args.email,
    });
    const saveUser = await UserModel.createUser({
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

const getMagicLinkDetails = async (args) => {
  try {
    const isUserExists = await UserModel.findUser({ email: args.email });
    if (!isUserExists) {
      return {
        isError: true,
        message: "user not exists,please register with us",
      };
    }
    const getMagicLinkDetails = await UserModel.findUserByMagicLink(args);
    if (getMagicLinkDetails.length == 0) {
      return {
        isError: true,
        message: "magic link is expired",
      };
    } else {
      if (getMagicLinkDetails[0].magic_link_token !== args.magic_link_token) {
        return {
          isError: true,
          message: "invalid magic link",
        };
      } else {
        const getToken = createJWTToken({
          id: isUserExists.id,
          email: args.email,
        });
        return {
          isError: false,
          data: { jwt: getToken },
          message: "magic link is correct",
        };
      }
    }
  } catch (error) {
    return {
      isError: true,
      message: "something went wrong, while user creating",
      data: [],
    };
  }
};

const UserService = {
  createUserService,
  getMagicLinkDetails,
};
export default UserService;
