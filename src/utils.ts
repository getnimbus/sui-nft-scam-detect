export const validateSuiAddress = (address: string): boolean => {
  if (!address) {
    return false;
  }
  if (/^0x[a-fA-F0-9]{64}$/.test(address)) {
    return true;
  }
  return false;
};
