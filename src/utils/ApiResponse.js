const successResponse = (data, message, statusCode) => {
  return {
    status: "success",
    message,
    data,
    statusCode,
  };
};

const errorResponse = (message, statusCode) => {
  return {
    status: "error",
    message,
    statusCode,
  };
};
export { successResponse, errorResponse };
