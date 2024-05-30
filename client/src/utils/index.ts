import numeral from "numeral";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const formatCurrency = (input: number) => {
  return numeral(input).format("0,0.[000000]");
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
