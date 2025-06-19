// todo: handling api errors

// ** The stack [which is the callstack] keeps track of what happens during a query or operation

// ** The call stack keeps a trace of active function calls. When a function is called, it is pushed onto the stack, and when it finishes, it is popped off, allowing the program to return to the previous function.

class apiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string | undefined, stack = "") {
    super(message);
    this.statusCode = statusCode;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default apiError;

// todo: fn approach

/*
// Define an interface for the error object for better type-checking
interface ApiError extends Error {
  statusCode: number;
}

const createApiError = (
  statusCode: number,
  message: string | undefined,
  stack: string = ""
): ApiError => {
  // Create a new error object to get the default error properties
  const error = new Error(message) as ApiError;

  // Add the custom statusCode property
  error.statusCode = statusCode;

  // Set the stack trace
  if (stack) {
    // If a stack is provided, use it
    error.stack = stack;
  } else {
    // Otherwise, capture a new stack trace.
    // We create a temporary error just to capture the current stack trace,
    // and then assign it to our main error object.
    Error.captureStackTrace(error, createApiError);
  }

  // To make it behave more like an instance of a specific type,
  // you can set its name. This helps in debugging.
  error.name = "ApiError";

  return error;
};

export default createApiError;
*/
