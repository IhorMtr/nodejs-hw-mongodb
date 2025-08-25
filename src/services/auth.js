import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import { SessionCollection } from '../db/models/session.js';
import { UserCollection } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';

export async function registerUser(payload) {
  const { email, password, ...rest } = payload;

  const existing = await UserCollection.findOne({ email });
  if (existing) {
    const err = new Error('Email in use');
    err.code = 'USER_EXISTS';
    throw err;
  }

  const hashedPass = await bcrypt.hash(password, 10);

  const registeredUser = await UserCollection.create({
    ...rest,
    email,
    password: hashedPass,
  });

  return registeredUser;
}

export async function loginUser(payload) {
  const { email, password, ...rest } = payload;

  const user = await UserCollection.findOne({ email });
  if (!user) {
    const err = new Error('User not found');
    err.code = 'USER_NOT_FOUND';
    throw err;
  }

  const hashedPass = await bcrypt.compare(password, user.password);

  if (!hashedPass) {
    const err = new Error('Password is incorrect');
    err.code = 'PASSWORD_IS_INCORRECT';
    throw err;
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
}

export async function refreshSession(cookies) {
  const { refreshToken, sessionId } = cookies;

  if (!refreshToken || !sessionId) {
    const err = new Error('No refresh token / session id');
    err.code = 'NO_SESSION';
    throw err;
  }

  const session = await SessionCollection.findById(sessionId);
  if (!session) {
    const err = new Error('Session not found');
    err.code = 'SESSION_INVALID';
    throw err;
  }

  if (session.refreshTokenValidUntil <= new Date()) {
    const err = new Error('Refresh token expired');
    err.code = 'TOKEN_EXPIRED';
    throw err;
  }

  if (refreshToken !== session.refreshToken) {
    const err = new Error('Tokens do not match');
    err.code = 'TOKEN_MISMATCH';
    throw err;
  }

  const newAccessToken = randomBytes(30).toString('base64');
  const newRefreshToken = randomBytes(30).toString('base64');

  const newSession = await SessionCollection.create({
    userId: session.userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });

  await SessionCollection.deleteOne({ _id: sessionId });

  return newSession;
}

export async function logoutUser(sessionId) {
  await SessionCollection.deleteOne({ _id: sessionId });
}
