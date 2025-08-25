import createHttpError from 'http-errors';
import { SessionCollection } from '../db/models/session.js';
import { UserCollection } from '../db/models/user.js';

export async function authenticate(req, res, next) {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    next(createHttpError(401, 'Unauthorized'));
    return;
  }

  const [bearer, token] = authHeader.trim().split(' ');

  if (bearer !== 'Bearer' || !token) {
    next(createHttpError(401, 'Unauthorized'));
    return;
  }

  const session = await SessionCollection.findOne({ accessToken: token });

  if (!session) {
    next(createHttpError(401, 'Session not found'));
    return;
  }

  if (session.accessTokenValidUntil <= new Date()) {
    next(createHttpError(401, 'Access token expired'));
    return;
  }

  const user = await UserCollection.findById(session.userId);

  if (!user) {
    next(createHttpError(401));
    return;
  }
  req.user = user;

  next();
}
