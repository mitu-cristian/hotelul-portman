class ErrorResponse extends Error {
    constructor(message, statusCode) {
// We are calling the constructor of the Error class
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = ErrorResponse;