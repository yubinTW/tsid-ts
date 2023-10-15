import { describe, expect, test } from 'vitest'

import { getTsid, TSID } from '../src/index'

describe('Usage Testing', () => {
  describe('getTsid()', () => {
    test('When invoke getTsid(), it should return TSID object and that can use .toBigInt() and .toString() functions', () => {
      const tsid: TSID = getTsid()
      const number = tsid.toBigInt()
      const string = tsid.toString()
      expect(number).toBeTruthy()
      expect(string).toBeTruthy()
    })
    test('When invoke .toString() of a TSID object, it should return 13-char length string', () => {
      const tsid = getTsid()
      const tsidString = tsid.toString()
      expect(tsidString).toHaveLength(13)
    })
  })
})
