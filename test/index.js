const match = require('..');
const expect = require('unexpected');

describe('deep-match', () => {
  it('should match primitives', () => {
    expect(match('a', 'a'), 'to be true');
    expect(match('a', 'b'), 'to be false');
    expect(match('1', '1'), 'to be true');
    expect(match('1', '2'), 'to be false');
    expect(match(true, true), 'to be true');
    expect(match(true, false), 'to be false');
    expect(match(null, null), 'to be true');
  });

  it('should not coerce types', () => {
    expect(match('1', 1), 'to be false');
    expect(match('true', true), 'to be false');
    expect(match([], ''), 'to be false');
  });

  it('should compare properties', () => {
    expect(match({ a: 1, b: 2 }, { a: 1, b: 2 }), 'to be true');
    expect(match({ a: 1, b: 2 }, { a: 2, b: 2 }), 'to be false');
  });

  it('should ignore extra properties', () => {
    expect(match({ a: 1, b: 2 }, { a: 1 }), 'to be true');
    expect(match({ a: 1, b: 2 }, { a: 2 }), 'to be false');
  });

  it('should not match when properties are missing', () => {
    expect(match({ a: 1 }, { a: 1, b: 2 }), 'to be false');
  });

  it('should compare nested objects', () => {
    expect(match({ a: { b: 1, c: 2 } }, { a: { b: 1 } }), 'to be true');
    expect(match({ a: { b: 1, c: 2 } }, { a: { b: 2 } }), 'to be false');
    expect(match({ a: { b: { c: 1 } } }, { a: { b: { } } }), 'to be true');
    expect(match({ a: { b: { c: 1 } } }, { a: { c: 2 } }), 'to be false');
  });

  it('should compare arrays', () => {
    expect(match([], []), 'to be true');
    expect(match([1], []), 'to be true');
    expect(match([], [1]), 'to be false');
    expect(match([1, 2, 3], [3, 1]), 'to be true');
    expect(match([1, 2, 3], [2, 4]), 'to be false');
  });

  it('should compare arrays inside objects', () => {
    expect(match({ a: [1, 2] }, { a: [1] }), 'to be true');
    expect(match({ a: [1, 2] }, { a: [3] }), 'to be false');
  });

  it('should compare objects inside arrays', () => {
    expect(match([{ a: 1 }, { b: 2 }], [{ a: 1 }]), 'to be true');
    expect(match([{ a: 1 }, { b: 2 }], [{ b: 2 }, { a: 1 }]), 'to be true');
    expect(match([{ a: 1 }, { b: 2 }], []), 'to be true');
    expect(match([{ a: 1 }, { b: 2 }], [{ b: 3 }]), 'to be false');
  });

  it('should handle undefined and null values', () => {
    expect(match(undefined, ''), 'to be false');
    expect(match(undefined, { }), 'to be false');
    expect(match(undefined, []), 'to be false');
    expect(match(undefined, /undefined/), 'to be false');
    expect(match(null, ''), 'to be false');
    expect(match(null, { }), 'to be false');
    expect(match(null, []), 'to be false');
    expect(match(null, /null/), 'to be false');
    expect(match('', undefined), 'to be false');
    expect(match({ }, undefined), 'to be false');
    expect(match([], undefined), 'to be false');
    expect(match(/u/, undefined), 'to be false');
    expect(match('', null), 'to be false');
    expect(match({ }, null), 'to be false');
    expect(match([], null), 'to be false');
    expect(match(/u/, null), 'to be false');
  });

  it('should execute regular expressions', () => {
    expect(match('aaa', /a+/), 'to be true');
    expect(match('aaa', /b+/), 'to be false');
    expect(match(['aaa', 'bbb'], [/a+/]), 'to be true');
    expect(match(['aaa', 'bbb'], [/a+/, /b+/]), 'to be true');
    expect(match(['aaa', 'bbb'], [/a+/, /c+/]), 'to be false');
  });

  it('should execute functions', () => {
    function isOne(value) {
      return value === 1;
    }
    expect(match(1, isOne), 'to be true');
    expect(match(2, isOne), 'to be false');
    expect(match({ one: 1, two: 2 }, { one: isOne }), 'to be true');
    expect(match({ one: 1, two: 2 }, { two: isOne }), 'to be false');
    expect(match([2, 3], [isOne]), 'to be false');
    expect(match([1, 2], [isOne]), 'to be true');
    expect(match([2, 3], [isOne]), 'to be false');
  });
});

describe('deep-match arrayOrderMatters', () => {
  // default behavior should be the same as using { arrayOrderMatters: false }

  it('should match basic array', () => {
    var source = [1, 2];
    var matcher = [1, 2];
    expect(match(source, matcher, { arrayOrderMatters: true }), 'to be true');
    expect(match(source, matcher, { arrayOrderMatters: false }), 'to be true');
    expect(match(source, matcher), 'to be true');

    source = [1, 2];
    matcher = [2, 1];
    expect(match(source, matcher, { arrayOrderMatters: true }), 'to be false');
    expect(match(source, matcher, { arrayOrderMatters: false }), 'to be true');
    expect(match(source, matcher), 'to be true');
  });

  it('should skip matching undefined items', () => {
    var source = [];
    var matcher = [];
    expect(match(source, matcher, { arrayOrderMatters: true }), 'to be true');
    expect(match(source, matcher, { arrayOrderMatters: false }), 'to be true');
    expect(match(source, matcher), 'to be true');

    source = [1, 2, 3, 4, 5];
    matcher = [undefined, 2, undefined, 4];
    expect(match(source, matcher, { arrayOrderMatters: true }), 'to be true');
    expect(match(source, matcher, { arrayOrderMatters: false }), 'to be false');
    expect(match(source, matcher), 'to be false');

    source = [1, 2, 3, 4, 5];
    matcher = [undefined, 2, 4];
    expect(match(source, matcher, { arrayOrderMatters: true }), 'to be false');
    expect(match(source, matcher, { arrayOrderMatters: false }), 'to be false');
    expect(match(source, matcher), 'to be false');
  });

  it('should match nested arrays', () => {
    var source = { v1: 'val', a1: [{ i1: [] }, { i2: [1, 2, [31, 32, 33], 4, 5] }] };
    var matcher = { v1: 'val', a1: [{ i2: [1] }] };
    expect(match(source, matcher, { arrayOrderMatters: true }), 'to be false');
    expect(match(source, matcher, { arrayOrderMatters: false }), 'to be true');
    expect(match(source, matcher), 'to be true');

    source = { v1: 'val', a1: [{ i1: [] }, { i2: [1, 2, [31, 32, 33], 4, 5] }] };
    matcher = {
      v1: 'val',
      a1: [{ i1: [] }, { i2: [1, undefined, [undefined, 32, 33], undefined, 5] }],
    };
    expect(match(source, matcher, { arrayOrderMatters: true }), 'to be true');
    expect(match(source, matcher, { arrayOrderMatters: false }), 'to be false');
    expect(match(source, matcher), 'to be false');

    source = { v1: 'val', a1: [{ i1: [] }, { i2: [1, 2, [31, 32, 33], 4, 5] }] };
    matcher = { v1: 'val', a1: [{ i1: [] }, { i2: [1, undefined, [32, 33], undefined, 5] }] };
    expect(match(source, matcher, { arrayOrderMatters: true }), 'to be false');
    expect(match(source, matcher, { arrayOrderMatters: false }), 'to be false');
    expect(match(source, matcher), 'to be false');

    source = { v1: 'val', a1: [{ i1: [] }, { i2: [1, 2, [31, 32, 33], 4, 5] }] };
    matcher = { v1: 'val', a1: [{ i1: [] }, { i2: [1, 2, [31, 32, 33], 4, 5] }] };
    expect(match(source, matcher, { arrayOrderMatters: true }), 'to be true');
    expect(match(source, matcher, { arrayOrderMatters: false }), 'to be true');
    expect(match(source, matcher), 'to be true');
  });
});
