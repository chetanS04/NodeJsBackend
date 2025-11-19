class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static success(message = "Success", data = null, statusCode = 200) {
    return new ApiResponse(statusCode, message, data);
  }

  static error(message = "Error", statusCode = 500, data = null) {
    return new ApiResponse(statusCode, message, data);
  }
}

module.exports = ApiResponse;
