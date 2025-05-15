
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(priceInCents) {
  const price = parseFloat(priceInCents);
  const dollars = price / 100;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: dollars % 1 !== 0 ? 2 : 0,
  }).format(dollars);
}

export function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function checkRequiredEnv() {
  if (!process.env.LEMONSQUEEZY_API_KEY) {
    throw new Error("Missing LEMONSQUEEZY_API_KEY. Set it in your .env file.");
  }

  if (!process.env.LEMONSQUEEZY_STORE_ID) {
    throw new Error("Missing LEMONSQUEEZY_STORE_ID. Set it in your .env file.");
  }

  if (!process.env.LEMONSQUEEZY_STORE_ID) {
    throw new Error("Missing LEMONSQUEEZY_API_KEY. Set it in your .env file.");
  }
}

export function isValidSubscription(status) {
  return status !== "cancelled" && status !== "expired" && status !== "unpaid";
}

export function takeUniqueOrThrow(values) {
  if (values.length !== 1)
    throw new Error("Found non unique or inexistent value");
  return values[0];
}