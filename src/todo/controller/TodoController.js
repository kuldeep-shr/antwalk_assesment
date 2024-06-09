import { successResponse, errorResponse } from "../../utils/ApiResponse.js";
import TodoService from "../services/TodoService.js";

const createTodo = async (req, res) => {
  try {
    const { title, description, status, priority, due_date } = req.body;
    const newTodo = await TodoService.createTodo({
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

const listTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 5 } = req.query; // Pagination parameters with default values
    const status = req.query.status || "";
    const priority = req.query.priority || "";
    const title = req.query.title || "";
    const description = req.query.description || "";
    const userId = req.user.id;

    // Parse sortBy and sortDirection as arrays
    const sortBy = req.query.sortBy ? req.query.sortBy.split("|") : [];
    const sortDirection = req.query.sortDirection
      ? req.query.sortDirection.split("|")
      : [];

    // Combine sortBy and sortDirection into an array of objects
    const sortCriteria = sortBy.map((column, index) => ({
      column: column,
      direction: sortDirection[index] || "asc", // Default to 'asc' if direction is not specified
    }));

    // Initialize the args object
    const args = {
      todoId: id ? parseInt(id) : 0,
      userId: userId,
      selectedStatus: status ? status.split("|") : [],
      selectedPriority: priority ? priority.split("|") : [],
      title: title,
      description: description,
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy: sortCriteria,
    };

    const listTodo = await TodoService.listTodo(args);
    return res.status(200).json(successResponse(listTodo, "todo list", 200));
  } catch (error) {
    res.status(400).json(errorResponse(error.message, 400));
  }
};

export { createTodo, updateTodo, listTodo };
