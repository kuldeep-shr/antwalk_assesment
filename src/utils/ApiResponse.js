const successResponse = (data, message = "success", statusCode = 200) => {
  return {
    status: "success",
    message,
    data,
    statusCode,
  };
};

const errorResponse = (message = "Internal Server Error", statusCode = 500) => {
  return {
    status: "error",
    message,
    statusCode,
  };
};
export { successResponse, errorResponse };
