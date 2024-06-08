import TodoModel from "../model/Todo.js";

const createTodo = async (args) => {
  const newTodo = await TodoModel.createTodo(args);
  return {
    data: newTodo,
  };
};
const updateTodo = async (id, args) => {
  const updateTodo = await TodoModel.updateTodo(id, args);
  return {
    data: updateTodo,
  };
};

const TodoService = {
  createTodo,
  updateTodo,
};
export default TodoService;
