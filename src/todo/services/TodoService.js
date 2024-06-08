import TodoModel from "../model/Todo.js";

const createTodoList = async (args) => {
  const newTodo = await TodoModel.createTodoList(args);
  return {
    data: newTodo.rows,
  };
};

const TodoService = {
  createTodoList,
};
export default TodoService;
