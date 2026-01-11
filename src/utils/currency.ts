/**
 * Currency formatting utilities
 */

/**
 * Formats a number or string value as Indonesian currency format
 * @param value - The value to format (number or string)
 * @returns Formatted string with Indonesian number format (e.g., "1.000.000")
 */
export const formatCurrency = (value: string | number): string => {
  const numValue =
    typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value
  if (isNaN(numValue)) return value.toString()
  return new Intl.NumberFormat('id-ID').format(numValue)
}

/**
 * Parses a price string and converts it to a number
 * Removes commas and non-numeric characters except decimal points
 * @param priceStr - The price string to parse
 * @returns The parsed number, or 0 if parsing fails
 */
export const parsePrice = (priceStr: string): number => {
  const cleaned = priceStr.replace(/,/g, '').replace(/[^\d.]/g, '')
  return parseFloat(cleaned) || 0
}
