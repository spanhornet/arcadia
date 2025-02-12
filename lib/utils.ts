import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitials = (name: string) => {
  const names = name.split(" ");
  const initials = names[0][0] + (names[1] ? names[1][0] : "");
  return initials.toUpperCase();
};