import validator from 'validator';

export const validateEmail = (email) => validator.isEmail(email);
export const validatePassword = (password) => password.length >= 8;
