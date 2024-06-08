import { successResponse, errorResponse } from "../../utils/ApiResponse.js";
import TodoService from "../services/TodoService.js";

const createTodo = async (req, res) => {
  try {
    const { title, description, status, priority, due_date } = req.body;
    const newTodo = await TodoService.createTodoList({
      user_id: req.user.id,
      title: title,
      description: description,
      status: status,
      priority: priority,
      due_date: due_date,
    });
    return res
      .status(201)
      .json(successResponse(newTodo.data, "todo is created", 201));
  } catch (error) {
    res.status(400).json(errorResponse(error.message, 400));
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const updateTodo = await TodoService.updateTodo(id, fields);
    return res
      .status(200)
      .json(
        successResponse(updateTodo.data, "todo is updated successfully", 200)
      );
  } catch (error) {
    res.status(400).json(errorResponse(error.message, 400));
  }
};

export { createTodo, updateTodo };
