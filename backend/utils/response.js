const response = (res, statusCode = 200, message = 'Success', data = null) => {
  res.status(statusCode).json({
    statusCode,
    message,
    data
  });
};

module.exports = response;