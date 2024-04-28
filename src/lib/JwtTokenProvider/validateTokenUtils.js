export const validateToken = (token, request) => {
  if (token.roles && token.roles.indexOf("Everyone") > -1) {
    return { isValid: true };
  }
  return { isValid: false };
};

export const validateError = (errorContext) => {
  errorContext.message = null;
  return errorContext;
};
