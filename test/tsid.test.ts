import fc from 'fast-check'
import { describe, expect, test } from 'vitest'

import { getTsid, TSID } from '../src'

const TSID_BYTES_LENGTH = 8
const RANDOM_MASK = 0x3fffff

describe('TSID Testing', () => {
  test('TSID Can be stored as a bigint', () => {
    const tsid = getTsid()
    expect(tsid.toBigInt()).toBeTypeOf('bigint')
  })
  test('TSID can be stored as 13-chars length string', () => {
    const tsid = getTsid()
    expect(tsid.toString()).toHaveLength(13)
  })
  test('Create three TSIDs and ensure that they are in ascending order.', () => {
    const tsid1 = getTsid()
    const tsid2 = getTsid()
    const tsid3 = getTsid()
    expect(tsid1.toBigInt()).toBeLessThan(tsid2.toBigInt())
    expect(tsid2.toBigInt()).toBeLessThan(tsid3.toBigInt())
  })
  test('Create a list of three TSIDs, When them are sorted by bigint in ascending order, Than the array would not be change', () => {
    const tsidArray: Array<TSID> = [getTsid(), getTsid(), getTsid()]
    const sortedTsidArray = [...tsidArray].sort((a, b) => Number(a.toBigInt() - b.toBigInt()))
    expect(tsidArray).toStrictEqual(sortedTsidArray)
  })
  test('Create a list of three TSIDs, When them are sorted by string in ascending order, Than the array would not be change', () => {
    const tsidArray: Array<TSID> = [getTsid(), getTsid(), getTsid()]
    const sortedTsidArray = [...tsidArray].sort((a, b) => a.toString().localeCompare(b.toString()))
    expect(tsidArray).toStrictEqual(sortedTsidArray)
  })
  test('When create 100_000 count of TSID, it should have no collision', () => {
    const tsidArray: Array<TSID> = Array.from({ length: 100_000 }, () => getTsid())
    const tsidSet = new Set(tsidArray)
    expect(tsidSet).toHaveLength(100_000)
  })

  test('TSID number should be a bigint', () => {
    const tsid = getTsid()
    expect(tsid.number).toBeTypeOf('bigint')
  })

  test('TSID timestamp should be close to the current time', () => {
    const tsid = getTsid()
    const currentTime = Date.now()
    const timestamp = tsid.timestamp
    expect(timestamp - currentTime).toBeLessThan(1000)
  })

  test('TSID random component should be within the valid range', () => {
    const tsid = getTsid()
    const random = tsid.random
    expect(random).toBeGreaterThanOrEqual(0)
    expect(random).toBeLessThanOrEqual(RANDOM_MASK)
  })

  test('TSID toBytes should return a Uint8Array with the correct length', () => {
    const tsid = getTsid()
    const bytes = tsid.toBytes()
    expect(bytes).toBeInstanceOf(Uint8Array)
    expect(bytes).toHaveLength(TSID_BYTES_LENGTH)
  })

  test('TSID toString should return a 13-character canonical string', () => {
    const tsid = getTsid()
    const str = tsid.toString()
    expect(str).toHaveLength(13)
  })

  test('TSID toStringWithFormat should return the expected string format', () => {
    const tsid = getTsid()
    const canonicalString = tsid.toStringWithFormat('S')
    const hexString = tsid.toStringWithFormat('X')
    const decimalString = tsid.toStringWithFormat('d')
    const base62String = tsid.toStringWithFormat('z')

    expect(canonicalString).toHaveLength(13)
    expect(hexString).toMatch(/^[0-9A-F]+$/)
    expect(decimalString).toMatch(/^\d+$/)
    expect(base62String).toMatch(/^[0-9A-Za-z]+$/)
  })

  test('TSID fromBytes should create a TSID with the correct number', () => {
    const bytes = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1])
    const tsid = TSID.fromBytes(bytes)
    expect(tsid.number).toBe(BigInt(1))
  })

  test('TSID fromString should create a TSID with the correct number', () => {
    const str = '0FG9Y986E7Y6M'
    const tsid = TSID.fromString(str, 'S')
    expect(tsid.number).toBe(558796316535421140n)
  })

  test('TSID generated with constructor should be equal to the one generated with fromString', () => {
    const str = '0FG9Y986E7Y6M'
    const tsid1 = TSID.fromString(str, 'S')
    const tsid2 = new TSID(tsid1.number)
    expect(tsid1.number).toEqual(tsid2.number)
    expect(tsid1.toBytes()).toEqual(tsid2.toBytes())
    expect(tsid1.toString()).toEqual(tsid2.toString())
  });

  test('Random TSID should be compatible across types', () => {
    const tsid1 = getTsid()
    const tsid2 = TSID.fromBytes(tsid1.toBytes())
    const tsid3 = TSID.fromString(tsid1.toString(), 'S')
    const tsid4 = new TSID(tsid1.number)
    expect(tsid1.number).toEqual(tsid2.number)
    expect(tsid1.number).toEqual(tsid3.number)
    expect(tsid1.number).toEqual(tsid4.number)
  });

  describe('Property-based Testing', () => {
    test('For any size TSID array, first item should small than the second one', () => {
      fc.assert(
        fc.property(fc.integer({ min: 2, max: 10_000 }), (size) => {
          const arr: Array<TSID> = Array.from({ length: size }, () => getTsid())
          expect(arr[0].toBigInt()).toBeLessThan(arr[1].toBigInt())
        })
      )
    })
    test('For any size TSID array, last item should bigger than the last second one', () => {
      fc.assert(
        fc.property(fc.integer({ min: 2, max: 10_000 }), (size) => {
          const arr: Array<TSID> = Array.from({ length: size }, () => getTsid())
          expect(arr.pop()?.toBigInt()).toBeGreaterThan(arr[0].toBigInt())
        })
      )
    })
    test('For any size TSID array, each item should be unique', () => {
      fc.assert(
        fc.property(fc.integer({ min: 2, max: 10_000 }), (size) => {
          const tsidArr: Array<TSID> = Array.from({ length: size }, () => getTsid())
          const tsidSet: Set<TSID> = new Set(tsidArr)
          expect(tsidArr).toHaveLength(tsidSet.size)
        })
      )
    })
  })
})
