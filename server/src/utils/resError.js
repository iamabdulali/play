export const apiResponse = (res, status, message) => {
  return res.status(status).json({
    message,
    success: status > 100 && status < 300 ? true : false,
  });
};
