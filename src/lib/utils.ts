import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrencyWithFormatterNumber = (value: number) => {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 1,
  });

  if (value < 1000) {
    return formatter.format(value).slice(0, -2);
  } else if (value < 1000000) {
    return formatter.format(value / 1000).slice(0, -2) + " rb";
  } else if (value < 1000000000) {
    return formatter.format(value / 1000000) + " jt";
  } else {
    return formatter.format(value / 1000000000) + " M";
  }
};

export const dateFormat = (date: Date | string) => {
  const jakartaTimezone = "Asia/Jakarta";

  // Format waktu dengan timezone Jakarta
  const formattedDate = new Date(date).toLocaleString("id-ID", {
    timeZone: jakartaTimezone,
    hour12: false,
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return formattedDate;
};

export const dateFormatFns = (date: Date | string) => {
  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const dateTimeFormat = (date: Date | string) => {
  const d = new Date(date);

  if (isNaN(d.getTime())) return "-";

  const formatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Memastikan format 24 jam
  });

  return formatter
    .formatToParts(d)
    .map((part) => {
      if (part.type === "literal" && part.value.includes("pukul")) {
        return ", ";
      }
      return part.value;
    })
    .join("")
    .trim();
};

export const truncate = (str: string, n: number) => {
  return str?.length > n ? str.substring(0, n - 1) + "..." : str;
};
