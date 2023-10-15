import { describe, expect, test } from 'vitest'

import { getTsid, TSID } from '../src'

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
})
