import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const compactNumberFormat = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

// 6606 -> "6.6K", 337 -> "337"
export function formatCompact(value: number) {
  return compactNumberFormat.format(value);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
