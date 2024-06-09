import Joi from "joi";
import { errorResponse } from "../utils/ApiResponse.js";

const registerSchema = Joi.object({
  name: Joi.string().required().error(new Error("please enter the name")),
  email: Joi.string()
    .email()
    .required()
    .error(new Error("please enter the valid email")),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .error(new Error("please enter the valid email")),
});

const updateSchema = Joi.object({
  name: Joi.string()
    .required()
    .error(new Error("for now you can update `name` only")),
});

const registerSchemaValidation = (req, res, next) => {
  const data = req.body;
  const { error } = registerSchema.validate(data);
  if (error) {
    return res.status(422).json(errorResponse(error.message, 422));
  }
  next();
};

const loginSchemaValidation = (req, res, next) => {
  const data = req.body;
  const { error } = loginSchema.validate(data);
  if (error) {
    return res.status(422).json(errorResponse(error.message, 422));
  }
  next();
};

const updateSchemaValidation = (req, res, next) => {
  const data = req.body;
  const { error } = updateSchema.validate(data);
  if (error) {
    return res.status(422).json(errorResponse(error.message, 422));
  }
  next();
};

export {
  registerSchemaValidation,
  loginSchemaValidation,
  updateSchemaValidation,
};
