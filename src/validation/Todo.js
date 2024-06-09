import Joi from "joi";
import { errorResponse } from "../utils/ApiResponse.js";

const createTodoSchema = Joi.object({
  title: Joi.string().required().error(new Error("please enter the title")),
  description: Joi.string()
    .required()
    .error(new Error("please enter the description")),
  status: Joi.string()
    .valid(
      "todo",
      "inprogress",
      "completed",
      "onhold",
      "canceled",
      "pending",
      "review"
    )
    .required()
    .error(
      new Error(
        "please select the status from this list 'todo','inprogress','completed','onhold','canceled','pending','review' "
      )
    ),

  priority: Joi.string()
    .valid("low", "medium", "high")
    .required()
    .error(
      new Error(
        "please select the priority from this list 'low','medium','high' "
      )
    ),
  due_date: Joi.date()
    .iso()
    .required()
    .error(new Error("please enter the due_date")),
});

const updateTodoSchema = Joi.object({
  title: Joi.string()
    .when("$strict", { is: true, then: Joi.required() })
    .min(1)
    .empty()
    .messages({
      "any.required": "title is required.",
      "string.empty": "title cannot be empty.",
    }),
  description: Joi.string()
    .when("$strict", { is: true, then: Joi.required() })
    .min(1),
  status: Joi.string()
    .valid(
      "todo",
      "inprogress",
      "completed",
      "onhold",
      "canceled",
      "pending",
      "review"
    )
    .error(
      new Error(
        "please select the status from this list 'todo','inprogress','completed','onhold','canceled','pending','review' "
      )
    ),
  priority: Joi.string()
    .valid("low", "medium", "high")
    .error(
      new Error(
        "please select the priority from this list 'low','medium','high' "
      )
    ),
  due_date: Joi.date().iso(),
})
  .min(1)
  .messages({
    "object.min":
      "please atleast select the single parameter from these 'title','description','status','priority','due_date' ",
  })
  .options({ abortEarly: false });

const createTodoSchemaValidation = (req, res, next) => {
  const data = req.body;
  const { error } = createTodoSchema.validate(data);
  if (error) {
    return res.status(422).json(errorResponse(error.message, 422));
  }
  next();
};

const updateTodoSchemaValidation = (req, res, next) => {
  const data = req.body;
  const { error } = updateTodoSchema.validate(data);
  if (error) {
    return res.status(422).json(errorResponse(error.message, 422));
  }
  next();
};

export { createTodoSchemaValidation, updateTodoSchemaValidation };
