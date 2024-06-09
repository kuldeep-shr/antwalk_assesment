import UserModel from "../model/User.js";
import { createJWTToken, createMagicLink } from "../../middlewares/Common.js";
import { sendEmail } from "../service/Email.js";

const createUser = async (args) => {
  try {
    // Validate email first
    const isUserExists = await UserModel.findUser({ email: args.email });
    if (isUserExists) {
      throw new Error("user already exists");
    }

    // Create magic link
    const magicLink = await createMagicLink({ email: args.email });

    // Create user
    const newUser = await UserModel.createUser({
      name: args.name,
      email: args.email,
      magic_link_token: magicLink.magic_link_token,
      magic_link_expires: magicLink.magic_link_expires,
    });

    newUser[0].magic_link_url = magicLink.magic_link_url;

    // Send email with magic link
    await sendEmail(
      args.email,
      "Magic Link",
      "",
      `<p>Hello ${args.name}, here's your magic link for login ${magicLink.magic_link_url} and it's available for 5 minutes</p>`
    );

    return {
      isError: false,
      message: "user created successfully and check your email for magic link",
      data: newUser,
    };
  } catch (error) {
    return {
      isError: true,
      message: error.message || "something went wrong while creating user",
    };
  }
};

const updateUser = async (userId, updateFields) => {
  // Add any business logic or validations here
  const updatedUser = await UserModel.updateUser(userId, updateFields);
  return {
    message: "user updated successfully",
    data: updatedUser,
  };
};

const login = async (args) => {
  try {
    // Validate email first
    const isUserExists = await UserModel.findUser({ email: args.email });
    if (!isUserExists) {
      throw new Error("user not exists with us");
    }

    // Create magic link
    const magicLink = await createMagicLink({ email: args.email });

    await UserModel.updateUser(isUserExists.id, {
      magic_link_token: magicLink.link,
      magic_link_expires: magicLink.magic_link_expires,
    });

    // Send email with magic link
    await sendEmail(
      args.email,
      "Magic Link",
      "",
      `<p>Hello ${isUserExists.name}, here's your magic link for login ${magicLink.magic_link_url} and it's available for 5 minutes</p>`
    );

    return {
      isError: false,
      data: [magicLink],
      message: "please check your email for magic link",
    };
  } catch (error) {
    return {
      isError: true,
      message: error.message || "something went wrong while login",
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
        const dataToUpdate = {
          magic_link_token: null,
          magic_link_expires: null,
        };

        await updateUser(isUserExists.id, dataToUpdate);

        const getToken = createJWTToken({
          id: isUserExists.id,
          email: args.email,
        });
        return {
          isError: false,
          data: [{ jwt: getToken }],
          message: "magic link is correct",
        };
      }
    }
  } catch (error) {
    return {
      isError: true,
      message: "something went wrong, while fetching magic link details",
      data: [],
    };
  }
};

const UserService = {
  createUser,
  getMagicLinkDetails,
  updateUser,
  login,
};
export default UserService;
