class InternalServerError extends Error {
    constructor(message) {
      super(message || "На сервере произошла ошибка");
      this.statusCode = 500;
    }
  }
  
  module.exports = InternalServerError;
