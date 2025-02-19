import { format, parseISO } from "date-fns";

const createArray = (n: number) => {
  return Array.from({ length: n }, (_, index) => index + 1);
}

const toCapitalCase = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const toDDMMYYYY = (date: string) => {
  return format(parseISO(date), "dd/MM/yyyy")
}

export { createArray, toCapitalCase, toDDMMYYYY }