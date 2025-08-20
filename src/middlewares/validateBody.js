import createHttpError from 'http-errors';

export function validateBody(validateSchema) {
  return async function (req, res, next) {
    try {
      await validateSchema.validateAsync(req.body, {
        abortEarly: false,
      });
      next();
    } catch (err) {
      next(
        createHttpError(400, 'Bad request', {
          errors: err.details,
        }),
      );
    }
  };
}
