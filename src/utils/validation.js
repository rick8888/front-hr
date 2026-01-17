export const useValidation = () => {
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(phone);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validateRequired = (value) => {
    return value !== null && value !== undefined && value !== "";
  };

  const validateMinLength = (value, length) => {
    return value.length >= length;
  };

  const validateMaxLength = (value, length) => {
    return value.length <= length;
  };

  return {
    validateEmail,
    validatePhoneNumber,
    validatePassword,
    validateRequired,
    validateMinLength,
    validateMaxLength,
  };
};
