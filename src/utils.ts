// Base 62
const ALPHABET: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

/**
 * Encodes a bigint value into a string representation using the specified base.
 * @param value - The bigint value to encode.
 * @param base - The base to use for encoding.
 * @param minLength - The minimum length of the encoded string. Optional.
 * @returns The encoded string.
 */
export function encode(value: bigint, base: number, minLength?: number): string {
  const result: Array<string> = []

  while (value > 0) {
    result.push(ALPHABET[Number(value % BigInt(base))])
    value = BigInt(Math.floor(Number(value / BigInt(base))))
  }

  if (minLength && result.length < minLength) {
    result.push(...Array(minLength - result.length).fill('0'))
  }

  return result.reverse().join('')
}

/**
 * Decodes a string value into a number using the specified base.
 * @param value The string value to decode.
 * @param base The base to use for decoding.
 * @returns The decoded number.
 */
export function decode(value: string, base: number): number {
  let result: number = 0

  for (const c of value) {
    result *= base
    result += ALPHABET.indexOf(c)
  }

  return result
}

/**
 * Generates a random integer between min (inclusive) and max (inclusive).
 *
 * @param {number} min - The minimum value of the range.
 * @param {number} max - The maximum value of the range.
 * @returns {number} A random integer between min and max (inclusive).
 */
export function uniformInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
