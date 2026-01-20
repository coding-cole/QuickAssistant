import * as yup from 'yup';
import { VALIDATION } from '@config/constants';

export const emailSchema = yup
  .string()
  .email('Please enter a valid email address')
  .max(
    VALIDATION.MAX_EMAIL_LENGTH,
    `Email must be less than ${VALIDATION.MAX_EMAIL_LENGTH} characters`
  )
  .required('Email is required');

export const passwordSchema = yup
  .string()
  .min(
    VALIDATION.MIN_PASSWORD_LENGTH,
    `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`
  )
  .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .matches(/[0-9]/, 'Password must contain at least one number')
  .required('Password is required');

export const nameSchema = yup
  .string()
  .max(
    VALIDATION.MAX_NAME_LENGTH,
    `Name must be less than ${VALIDATION.MAX_NAME_LENGTH} characters`
  )
  .required('Name is required');

export const loginSchema = yup.object({
  email: emailSchema,
  password: yup.string().required('Password is required'),
});

export const registerSchema = yup.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});
