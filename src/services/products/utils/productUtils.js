export const isValidSku = ({ sku }) => {
  const fhSkuRegex = /^FH\d{7}[a-zA-Z]$/;
  return fhSkuRegex.test(sku);
};
