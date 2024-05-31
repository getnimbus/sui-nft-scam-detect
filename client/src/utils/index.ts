import numeral from "numeral";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const formatCurrency = (input: number) => {
  return numeral(input).format("0.00000") === "NaN"
    ? 0.000001
    : numeral(input).format("0,0.[00000]");
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
