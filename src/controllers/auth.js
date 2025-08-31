import createHttpError from 'http-errors';
import {
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';
import { THIRTY_DAYS } from '../constants/index.js';

export async function registerUserController(req, res, next) {
  try {
    const createdUser = await registerUser(req.body);

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: createdUser,
    });
  } catch (err) {
    if (err.code === 'USER_EXISTS') {
      return next(createHttpError(409, 'Email in use'));
    }
    next(err);
    return;
  }
}

export async function loginUserController(req, res, next) {
  try {
    const session = await loginUser(req.body);

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + THIRTY_DAYS),
    });
    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: new Date(Date.now() + THIRTY_DAYS),
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (err) {
    if (err.code === 'USER_NOT_FOUND' || err.code === 'PASSWORD_IS_INCORRECT') {
      return next(createHttpError(401, 'Email or password is incorrect'));
    }

    next(err);
    return;
  }
}

export async function refreshSessionController(req, res, next) {
  try {
    const refreshedSession = await refreshSession(req.cookies);

    res.cookie('refreshToken', refreshedSession.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + THIRTY_DAYS),
    });
    res.cookie('sessionId', refreshedSession._id, {
      httpOnly: true,
      expires: new Date(Date.now() + THIRTY_DAYS),
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: refreshedSession.accessToken,
      },
    });
  } catch (err) {
    switch (err.code) {
      case 'TOKEN_EXPIRED':
        return next(createHttpError(401, 'Session expired'));
      case 'NO_SESSION':
      case 'SESSION_INVALID':
      case 'TOKEN_MISMATCH':
        return next(createHttpError(401, 'Unauthorized'));
    }
    return next(err);
  }
}

export async function logoutUserController(req, res, next) {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await logoutUser(sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
}

export async function requestResetTokenController(req, res, next) {
  try {
    const { email } = req.body;

    await requestResetToken(email);

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (err) {
    if (err.code === 'USER_NOT_FOUND') {
      return next(createHttpError(404, 'User not found'));
    }

    res.status(500).json({
      status: 500,
      message: 'Failed to send the email, please try again later.',
    });
  }
}

export async function resetPasswordController(req, res, next) {
  try {
    await resetPassword(req.body);

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (err) {
    if (err.code === 'USER_NOT_FOUND') {
      return next(createHttpError(404, 'User not found!'));
    }

    if (err.code === 'EXPIRED_OR_INVALID') {
      return next(createHttpError(401, 'Token is expired or invalid.'));
    }
    next(err);
    return;
  }
}
