import { createUserService } from "../service/AuthService.js";
import { successResponse, errorResponse } from "../../utils/ApiResponse.js";
import { sendEmail } from "../service/Email.js";

const register = async (req, res) => {
  try {
    const { name, email } = req.body;
    const savingData = await createUserService({ name: name, email: email });
    if (!savingData.isError) {
      await sendEmail(
        email,
        "Magic Link",
        "",
        `<p>Hello ${name}, here's your magic link for login ${savingData.data.magic_link_token}</p>`
      );
      return res
        .status(201)
        .json(successResponse(savingData.data, savingData.message, 201));
    } else {
      return res.status(400).json(errorResponse(savingData.message, 400));
    }
  } catch (error) {
    return res.status(500).json(errorResponse("Internal Server Error", 400));
  }
};

export { register };
