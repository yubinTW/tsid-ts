# TSID-TS

[![Node.js CI](https://github.com/yubinTW/tsid-ts/actions/workflows/node.js.yml/badge.svg)](https://github.com/yubinTW/tsid-ts/actions/workflows/node.js.yml)
[![NPM version](https://img.shields.io/npm/v/tsid-ts.svg?style=flat)](https://www.npmjs.com/package/tsid-ts)

A JavaScript/TypeScript library for generating Time-Sorted Unique Identifiers (TSID).

This library is a TypeScript implementation of [tsid-creator](https://github.com/f4b6a3/tsid-creator)

## What is a TSID?

In summary:

- Sorted by generation time;
- Can be stored as an bigint;
- Can be stored as a string of 13 chars;
- String format is encoded to [Crockford's base32](https://www.crockford.com/base32.html);
- String format is URL safe, is case insensitive, and has no hyphens;
- Shorter than UUID, ULID and KSUID.

## Installation

```
npm i tsid-ts
```

## Usage

Create a TSID:

```typescript
import { getTsid } from 'tsid-ts'
const tsid = getTsid()
```

Create a TSID as `bigint`:

```typescript
const number = getTsid().toBigInt() // 501438102971408389n
```

Create a TSID as `String`:

```typescript
const string = getTsid().toString() // 0DXBQ9H279R05
```

### TSID as bigint

The `Tsid.toBigInt()` method simply unwraps the internal `bigint` value of a TSID.

```typescript
const number = getTsid().toBigInt() // 501438102971408389n
```

Sequence of TSIDs:

```text
38352658567418867
38352658567418868
38352658567418869
38352658567418870
38352658567418871
38352658567418872
38352658567418873
38352658567418874
38352658573940759 < millisecond changed
38352658573940760
38352658573940761
38352658573940762
38352658573940763
38352658573940764
38352658573940765
38352658573940766
         ^      ^ look

|--------|------|
   time   random
```

### TSID as String

The `Tsid.toString()` method encodes a TSID to [Crockford's base 32](https://www.crockford.com/base32.html) encoding. The returned string is 13 characters long.

```typescript
const string = getTsid().toString() // 0DXBQ9H279R05
```

Sequence of TSID strings:

```text
01226N0640J7K
01226N0640J7M
01226N0640J7N
01226N0640J7P
01226N0640J7Q
01226N0640J7R
01226N0640J7S
01226N0640J7T
01226N0693HDA < millisecond changed
01226N0693HDB
01226N0693HDC
01226N0693HDD
01226N0693HDE
01226N0693HDF
01226N0693HDG
01226N0693HDH
        ^   ^ look

|-------|---|
   time random
```

The string format can be useful for languages that store numbers in [double-precision 64-bit binary format IEEE 754](https://en.wikipedia.org/wiki/Double-precision_floating-point_format), such as [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number).

### TSID Structure

The term TSID stands for (roughly) Time-Sorted ID. A TSID is a number that is formed by the creation time along with random bits.

The TSID has 2 components:

- Time component (42 bits)
- Random component (22 bits)

The time component is the count of milliseconds since 2020-01-01 00:00:00 UTC.

The Random component has 2 sub-parts:

- Node ID (0 to 20 bits)
- Counter (2 to 22 bits)

The counter bits depend on the node bits. If the node bits are 10, the counter bits are limited to 12. In this example, the maximum node value is 2^10-1 = 1023 and the maximum counter value is 2^12-1 = 4095. So the maximum TSIDs that can be generated per millisecond is 4096.

The node identifier uses 10 bits of the random component by default in the `TsidFactory`. It's possible to adjust the node bits to a value between 0 and 20. The counter bits are affected by the node bits.

This is the default TSID structure:

```
                                            adjustable
                                           <---------->
|------------------------------------------|----------|------------|
       time (msecs since 2020-01-01)           node       counter
                42 bits                       10 bits     12 bits

- time:    2^42 = ~69 years or ~139 years (with adjustable epoch)
- node:    2^10 = 1,024 (with adjustable bits)
- counter: 2^12 = 4,096 (initially random)

Notes:
The node is adjustable from 0 to 20 bits.
The node bits affect the counter bits.
The time component can be used for ~69 years if stored in a SIGNED 64 bits integer field.
The time component can be used for ~139 years if stored in a UNSIGNED 64 bits integer field.
```

The time component can be 1 ms or more ahead of the system time when necessary to maintain monotonicity and generation speed.

## License

This library is Open Source software released under the [MIT license](https://opensource.org/licenses/MIT).
