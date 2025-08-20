import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export async function isValidId(req, res, next) {
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    throw createHttpError('400', 'Bad request');
  }

  next();
}
