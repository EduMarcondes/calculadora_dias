import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export const formatDateToBr = (isoDate: string): string => {
  const [year, month, day] = isoDate.split("-");

  if (!year || !month || !day) {
    return isoDate;
  }

  return `${day}/${month}/${year}`;
};
