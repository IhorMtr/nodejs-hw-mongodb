import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9 _-]+$/)
    .required(),
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string()
    .min(8)
    .max(20)
    .pattern(/[A-Z]/)
    .pattern(/[a-z]/)
    .pattern(/[0-9]/)
    .pattern(/[@$!%*?&]/)
    .required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(8).required(),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string()
    .lowercase()
    .email({ tlds: { allow: false } })
    .required(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required(),
});
