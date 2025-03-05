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

export { createArray, toCapitalCase, toDDMMYYYY }

export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const toDDMMYYYY = (date: string | Date) => {
  try {
    // Se já for uma instância de Date, formata diretamente
    if (date instanceof Date) {
      return format(date, "dd/MM/yyyy");
    }
    
    // Se for uma string ISO válida
    if (typeof date === 'string') {
      return format(parseISO(date), "dd/MM/yyyy");
    }

    // Caso receba um tipo inesperado
    throw new Error('Tipo de data inválido');
    
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return 'Data inválida';
  }
}