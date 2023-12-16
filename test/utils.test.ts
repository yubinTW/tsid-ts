import { describe, expect, test } from 'vitest'

import { decode, encode } from '../src/utils'

describe('Encode Testing', () => {
  test('Encode a positive bigint value with base 10', () => {
    const value = BigInt(1234567890)
    const base = 10
    const expected = '1234567890'
    const result = encode(value, base)
    expect(result).toBe(expected)
  })

  test('Encode a positive bigint value with base 2', () => {
    const value = BigInt(42)
    const base = 2
    const expected = '101010'
    const result = encode(value, base)
    expect(result).toBe(expected)
  })

  test('Encode a positive bigint value with base 16', () => {
    const value = BigInt(255)
    const base = 16
    const expected = 'FF'
    const result = encode(value, base)
    expect(result).toBe(expected)
  })

  test('Encode a positive bigint value with base 36', () => {
    const value = BigInt(1234567890)
    const base = 36
    const expected = 'KF12OI'
    const result = encode(value, base)
    expect(result).toBe(expected)
  })

  test('Encode a positive bigint value with base 10 and minimum length', () => {
    const value = BigInt(42)
    const base = 10
    const minLength = 6
    const expected = '000042'
    const result = encode(value, base, minLength)
    expect(result).toBe(expected)
  })

  test('Encode a zero bigint value with base 10 will be empty string', () => {
    const value = BigInt(0)
    const base = 10
    const expected = ''
    const result = encode(value, base)
    expect(result).toBe(expected)
  })
})

describe('Decode Testing', () => {
  test('Decode a positive string value with base 10', () => {
    const value = '1234567890'
    const base = 10
    const expected = 1234567890
    const result = decode(value, base)
    expect(result).toBe(expected)
  })

  test('Decode a positive string value with base 2', () => {
    const value = '101010'
    const base = 2
    const expected = 42
    const result = decode(value, base)
    expect(result).toBe(expected)
  })

  test('Decode a positive string value with base 16', () => {
    const value = 'FF'
    const base = 16
    const expected = 255
    const result = decode(value, base)
    expect(result).toBe(expected)
  })

  test('Decode a positive string value with base 36', () => {
    const value = 'KF12OI'
    const base = 36
    const expected = 1234567890
    const result = decode(value, base)
    expect(result).toBe(expected)
  })

  test('Decode a string value with base 10 and minimum length', () => {
    const value = '000042'
    const base = 10
    const expected = 42
    const result = decode(value, base)
    expect(result).toBe(expected)
  })

  test('Decode an empty string value with base 10 will be zero', () => {
    const value = ''
    const base = 10
    const expected = 0
    const result = decode(value, base)
    expect(result).toBe(expected)
  })
})
