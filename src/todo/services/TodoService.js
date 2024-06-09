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

const TodoService = {
  createTodo,
  updateTodo,
  listTodo,
};
export default TodoService;
