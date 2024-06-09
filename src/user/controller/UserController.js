import UserService from "../service/UserService.js";
import { successResponse, errorResponse } from "../../utils/ApiResponse.js";

const register = async (req, res) => {
  try {
    const { name, email } = req.body;
    const savingData = await UserService.createUser({
      name: name,
      email: email,
    });

    // Check if an error occurred during user creation
    if (savingData.isError) {
      return res.status(400).json(errorResponse(savingData.message, 400));
    }

    return res
      .status(201)
      .json(successResponse(savingData.data, savingData.message, 201));
  } catch (error) {
    return res.status(500).json(errorResponse("internal server error", 500));
  }
};

const login = async (req, res) => {
  try {
    const { email } = req.body;
    const loginData = await UserService.login({
      email: email,
    });

    // Check if an error occurred during user creation
    if (loginData.isError) {
      return res.status(400).json(errorResponse(loginData.message, 400));
    }

    return res
      .status(200)
      .json(successResponse(loginData.data, loginData.message, 200));
  } catch (error) {
    return res.status(500).json(errorResponse("internal server error", 500));
  }
};

const updateUser = async (req, res) => {
  const { userId } = req.params;
  const updateFields = req.body;

  try {
    const updatedUser = await UserService.updateUser(userId, updateFields);
    res
      .status(200)
      .json(successResponse(updatedUser.data, updatedUser.message, 200));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const validationOfMagicLink = async (req, res) => {
  try {
    const validateLink = await UserService.getMagicLinkDetails({
      email: req.query.email,
      magic_link_token: req.query.link,
    });
    if (!validateLink.isError) {
      return res
        .status(200)
        .json(successResponse(validateLink.data, validateLink.message, 200));
    } else {
      return res.status(400).json(errorResponse(validateLink.message, 400));
    }
  } catch (error) {
    return res.status(500).json(errorResponse("internal server error", 400));
  }
};

export { register, login, validationOfMagicLink, updateUser };
