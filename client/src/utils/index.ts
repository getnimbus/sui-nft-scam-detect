import numeral from "numeral";

export const formatCurrency = (input: number) => {
  return numeral(input).format("0,0.[000000]");
};
