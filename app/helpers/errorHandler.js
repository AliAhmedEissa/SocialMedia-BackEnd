let stackVar;

export const asyncHandler = (API) => {
  return (req, res, next) => {
    API(req, res, next).catch((err) => {
    //   if (err.code == 11000) {
    //     stackVar = err.stack;
    //     next(new Error("Email is already exists", { cause: 409 }));
    //   }
      stackVar = err.stack;
      next(new Error(err.message, { cause: 500 }));
    });
  };
};

export { stackVar };
