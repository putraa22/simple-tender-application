import { describe, it, expect } from 'vitest'
import { formatCurrency, parsePrice } from '../currency'

describe('formatCurrency', () => {
  describe('with valid numbers', () => {
    it.each([
      [1000000, '1.000.000'],
      [25000000, '25.000.000'],
      [1234567, '1.234.567'],
      [999, '999'],
      [1000000000, '1.000.000.000'],
    ])('should format %d to %s', (input, expected) => {
      expect(formatCurrency(input)).toBe(expected)
    })
  })

  describe('with string numbers', () => {
    it.each([
      ['1000000', '1.000.000'],
      ['25000000', '25.000.000'],
      ['0', '0'],
    ])('should format "%s" to %s', (input, expected) => {
      expect(formatCurrency(input)).toBe(expected)
    })
  })

  describe('with strings containing commas', () => {
    it.each([
      ['1,000,000', '1.000.000'],
      ['25,000,000', '25.000.000'],
      ['1,234,567', '1.234.567'],
    ])('should format "%s" to %s', (input, expected) => {
      expect(formatCurrency(input)).toBe(expected)
    })
  })

  describe('with invalid input', () => {
    it.each([['invalid'], ['abc123'], ['not-a-number'], ['']])(
      'should return original string for "%s"',
      (input) => {
        expect(formatCurrency(input)).toBe(input)
      }
    )
  })

  describe('with edge cases', () => {
    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('0')
      expect(formatCurrency('0')).toBe('0')
    })

    it('should handle negative numbers', () => {
      expect(formatCurrency(-1000000)).toBe('-1.000.000')
      expect(formatCurrency(-25000000)).toBe('-25.000.000')
    })

    it('should handle decimal numbers', () => {
      expect(formatCurrency(1234.56)).toBe('1.234,56')
    })
  })
})

describe('parsePrice', () => {
  describe('with valid price strings', () => {
    it.each([
      ['1000000', 1000000],
      ['25000000', 25000000],
      ['1234567', 1234567],
    ])('should parse "%s" to %d', (input, expected) => {
      expect(parsePrice(input)).toBe(expected)
    })
  })

  describe('with strings containing commas', () => {
    it.each([
      ['1,000,000', 1000000],
      ['25,000,000', 25000000],
      ['1,234,567', 1234567],
    ])('should parse "%s" to %d', (input, expected) => {
      expect(parsePrice(input)).toBe(expected)
    })
  })

  describe('with decimal numbers', () => {
    it.each([
      ['1000.50', 1000.5],
      ['1,234.56', 1234.56],
      ['25.99', 25.99],
    ])('should parse "%s" to %f', (input, expected) => {
      expect(parsePrice(input)).toBeCloseTo(expected, 2)
    })
  })

  describe('with currency symbols and text', () => {
    it.each([
      ['Rp 1,000,000', 1000000],
      ['$25,000,000', 25000000],
      ['IDR 1,234,567', 1234567],
      ['Price: 1000000', 1000000],
    ])('should parse "%s" to number', (input, expected) => {
      expect(parsePrice(input)).toBe(expected)
    })
  })

  describe('with invalid input', () => {
    it.each([
      ['invalid', 0],
      ['', 0],
      ['abc', 0],
      ['---', 0],
    ])('should return 0 for "%s"', (input, expected) => {
      expect(parsePrice(input)).toBe(expected)
    })
  })

  describe('with edge cases', () => {
    it('should handle zero', () => {
      expect(parsePrice('0')).toBe(0)
      expect(parsePrice('0.00')).toBe(0)
    })

    it('should handle very large numbers', () => {
      expect(parsePrice('999999999999')).toBe(999999999999)
    })

    it('should handle multiple decimal points (takes first)', () => {
      expect(parsePrice('1.234.56')).toBe(1.234)
    })
  })
})
