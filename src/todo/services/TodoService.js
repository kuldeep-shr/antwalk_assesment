import TodoModel from "../model/Todo.js";

const createTodo = async (args) => {
  const newTodo = await TodoModel.createTodo(args);
  return {
    data: [newTodo],
  };
};
const updateTodo = async (id, args) => {
  try {
    // check todo id exists
    const getTodoDetails = await listTodo({ todoId: id });
    const updateTodo = await TodoModel.updateTodo(id, args);
    return {
      data: [updateTodo],
    };
  } catch (error) {
    throw error;
  }
};
const listTodo = async (args) => {
  const listTodo = await TodoModel.listTodo(args);
  return listTodo;
};

const deleteTodo = async (todoId, userId) => {
  try {
    const deletedTodo = await TodoModel.deleteTodoById(todoId, userId);
    if (deletedTodo.isError) {
      throw new Error(deletedTodo.message);
    }
    return {
      data: [deletedTodo],
      message: "todo deleted successfully",
    };
  } catch (error) {
    return {
      isError: true,
      message: error.message || "something went wrong while deleting the todo",
    };
  }
};

const TodoService = {
  createTodo,
  updateTodo,
  listTodo,
  deleteTodo,
};
export default TodoService;
