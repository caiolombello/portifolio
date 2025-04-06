export const locales = ["en", "pt", "es"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

