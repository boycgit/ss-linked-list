import { CircleDoublyList } from '../src/index';
import * as Chance from 'chance';
const chance = new Chance();

describe('双向循环链表 - 构造函数', () => {
  test('默认无参，生成空链表', () => {
    const a = new CircleDoublyList();
    expect(a.length).toBe(0);
    expect(a.head).toBeNull();
    expect(a.tail).toBeNull();
    expect(a.loopLength).toBe(0);
  });

  test('默认接受多个参数，生成双向循环链表', () => {
    const arr = chance.n(chance.integer, chance.integer({ min: 1, max: 10 }));
    const a = new CircleDoublyList(...arr);
    expect(a.length).toBe(arr.length);
    expect(a.head).toBe(arr[0]);
    expect(a.tail).toBe(arr[arr.length - 1]);
    expect(a.loopLength).toBe(arr.length);
  });
});

describe('双向循环链表 - 迭代器', () => {
  let a, arr;
  beforeEach(() => {
    arr = chance.n(chance.integer, chance.integer({ min: 1, max: 10 }));
    a = new CircleDoublyList(...arr);
  });
  afterEach(() => {
    expect(a.loopLength).toBe(arr.length);
  });
  test('调用 toArray，将列表转换成数组', () => {
    expect(a.toArray()).toEqual(arr);
    expect([...a]).toEqual(arr);
    let i = 0;
    for (const val of a) {
      expect(val).toBe(arr[i++]);
    }
  });
  test('调用 clone，返回克隆后的新链表', () => {
    const b = a.clone();
    expect([...b]).toEqual(arr);
    expect(b).toBeInstanceOf(CircleDoublyList);
    expect(b.loopLength).toBe(arr.length);
  });
});

describe('双向循环链表 - get 方法', () => {
  let a, arr;
  beforeEach(() => {
    arr = chance.n(chance.integer, chance.integer({ min: 1, max: 10 }));
    a = new CircleDoublyList(...arr);
  });
  test('获取指定位置的元素', () => {
    var index = chance.integer({ min: 0, max: arr.length - 1 });
    expect(a.get(index)).toBe(arr[index]);
    expect(a.loopLength).toBe(arr.length);
  });

  test('访问超过范围的元素时候将报错', () => {
    var len = arr.length;
    var index = chance.pickone([
      chance.integer({ min: -len, max: -1 }),
      chance.integer({ min: len, max: len * 2 })
    ]);
    expect(a.loopLength).toBe(arr.length);

    expect(() => {
      a.get(index);
    }).toThrowError();
  });

  test('访问空链表的时候也报错', () => {
    const emptyList = new CircleDoublyList();
    const index = chance.integer({ min: 0, max: 10 });
    expect(() => {
      emptyList.get(index);
    }).toThrowError();
  });
});

describe('双向循环链表 - append 方法', () => {
  let a, arr;
  beforeEach(() => {
    arr = chance.n(chance.integer, chance.integer({ min: 1, max: 10 }));
    a = new CircleDoublyList(...arr);
  });

  test('在链表末尾新增元素', () => {
    const newValue = chance.integer();
    const prevLength = a.length;
    const prevHeadValue = a.head;
    a.append(newValue);
    expect(a.head).toBe(prevHeadValue);
    expect(a.tail).toBe(newValue);
    expect(a.length).toBe(prevLength + 1);
    expect(a.loopLength).toBe(arr.length + 1);
  });
  test('给空链表尾部新增 1 个元素', () => {
    const b = new CircleDoublyList();
    const newValue = chance.integer();
    const prevLength = b.length;
    b.append(newValue);
    expect(b.head).toBe(newValue);
    expect(b.tail).toBe(newValue);
    expect(b.length).toBe(prevLength + 1);
    expect(b.loopLength).toBe(1);
  });
});

describe('双向循环链表 - prepend 方法', () => {
  let a, arr;
  beforeEach(() => {
    arr = chance.n(chance.integer, chance.integer({ min: 1, max: 10 }));
    a = new CircleDoublyList(...arr);
  });

  test('在链表头部新增元素', () => {
    const newValue = chance.integer();
    const prevLength = a.length;
    const prevTailValue = a.tail;
    a.prepend(newValue);
    expect(a.head).toBe(newValue);
    expect(a.tail).toBe(prevTailValue);
    expect(a.length).toBe(prevLength + 1);
    expect(a.loopLength).toBe(arr.length + 1);
  });
  test('给空链表头部新增 1 个元素', () => {
    const b = new CircleDoublyList();
    const newValue = chance.integer();
    const prevLength = b.length;
    b.prepend(newValue);
    expect(b.head).toBe(newValue);
    expect(b.tail).toBe(newValue);
    expect(b.length).toBe(prevLength + 1);
    expect(b.loopLength).toBe(1);
  });
});

describe('双向循环链表 - remove 方法', () => {
  let a, arr;
  beforeEach(() => {
    arr = chance.n(chance.integer, chance.integer({ min: 2, max: 10 }));
    a = new CircleDoublyList(...arr);
  });
  test('在链表中删除指定元素', () => {
    const index = chance.integer({ min: 1, max: arr.length - 1 });
    const targetValue = arr[index];
    const prevLength = a.length;
    expect(a.remove(targetValue)).toBe(targetValue);
    expect(a.length).toBe(prevLength - 1);
    expect(a.loopLength).toBe(arr.length - 1);
  });
  test('在链表中删除头部元素', () => {
    const prevLength = a.length;
    expect(a.remove(arr[0])).toBe(arr[0]);
    expect(a.length).toBe(prevLength - 1);
    expect(a.loopLength).toBe(arr.length - 1);
  });
  test('在链表中删除尾部元素', () => {
    const index = arr.length - 1;
    const targetValue = arr[index];
    const prevLength = a.length;
    expect(a.remove(targetValue)).toBe(targetValue);
    expect(a.length).toBe(prevLength - 1);
    expect(a.loopLength).toBe(arr.length - 1);
  });
  test('当只有 1 个元素时，删除后变成空列表', () => {
    const b = new CircleDoublyList(arr[0]);
    expect(b.remove(arr[0])).toBe(arr[0]);
    expect(b.head).toBeNull();
    expect(b.tail).toBeNull();
    expect(b.loopLength).toBe(0);
  });
});

describe('双向循环链表 - removeHead 方法', () => {
  let a, arr;
  beforeEach(() => {
    arr = chance.n(chance.integer, chance.integer({ min: 1, max: 10 }));
    a = new CircleDoublyList(...arr);
  });
  test('在链表中删除头部元素', () => {
    const prevLength = a.length;
    expect(a.removeHead()).toBe(arr[0]);
    expect(a.length).toBe(prevLength - 1);
    expect(a.loopLength).toBe(prevLength - 1);
  });
  test('当只有 1 个元素时，删除头部元素后变成空列表', () => {
    const b = new CircleDoublyList(arr[0]);
    expect(b.removeHead()).toBe(arr[0]);
    expect(b.head).toBeNull();
    expect(b.tail).toBeNull();
    expect(b.loopLength).toBe(0);
  });
  test('当没有元素时，删除头部元素将直接返回 undefinded', () => {
    const b = new CircleDoublyList();
    expect(b.removeHead()).toBeUndefined();
    expect(b.head).toBeNull();
    expect(b.tail).toBeNull();
    expect(b.loopLength).toBe(0);
  });
});

describe('双向循环链表 - removeTail 方法', () => {
  let a, arr;
  beforeEach(() => {
    arr = chance.n(chance.integer, chance.integer({ min: 1, max: 10 }));
    a = new CircleDoublyList(...arr);
  });
  test('在链表中删除尾部元素', () => {
    const prevLength = a.length;
    expect(a.removeTail()).toBe(arr[arr.length - 1]);
    expect(a.length).toBe(prevLength - 1);
    expect(a.loopLength).toBe(arr.length - 1);
  });
  test('当只有 1 个元素时，删除尾部元素后变成空列表', () => {
    const b = new CircleDoublyList(arr[0]);
    expect(b.removeTail()).toBe(arr[0]);
    expect(b.head).toBeNull();
    expect(b.tail).toBeNull();
    expect(b.loopLength).toBe(0);
  });
  test('当没有元素时，删除尾部元素将直接返回 undefinded', () => {
    const b = new CircleDoublyList();
    expect(b.removeTail()).toBeUndefined();
    expect(b.head).toBeNull();
    expect(b.tail).toBeNull();
    expect(b.loopLength).toBe(0);
  });
});

describe('双向循环链表 - first 方法', () => {
  let a, arr;
  beforeEach(() => {
    arr = chance.n(chance.integer, chance.integer({ min: 1, max: 10 }));
    a = new CircleDoublyList(...arr);
  });
  test('在链表中获取前 n 个数据', () => {
    const n = chance.integer({ min: 0, max: arr.length - 1 });
    expect(a.first(n)).toEqual(arr.slice(0, n));
    expect(a.loopLength).toBe(arr.length);
  });
  test('超过自身长度，循环返回数据', () => {
    const n = chance.integer({ min: arr.length, max: arr.length * 2 - 1 });
    expect(a.first(n)).toEqual(arr.concat(arr.slice(0, n - arr.length)));

    const n2 = chance.integer({ min: arr.length * 2, max: arr.length * 3 - 1 });
    expect(a.first(n2)).toEqual(
      arr.concat(arr).concat(arr.slice(0, n2 - arr.length * 2))
    );
    expect(a.loopLength).toBe(arr.length);
  });
  test('参数 num 必须大于 0 ', () => {
    const n = chance.integer({ min: -arr.length, max: -1 });
    expect(() => {
      a.first(n);
    }).toThrowError();
  });
});

describe('双向循环链表 - reverse 方法', () => {
  let arr;
  beforeEach(() => {
    arr = chance.n(chance.integer, chance.integer({ min: 1, max: 10 }));
  });
  test('对列表进行反转操作', () => {
    const a = new CircleDoublyList(...arr);
    a.reverse();
    expect([...a]).toEqual([...arr.reverse()]);
    expect(a.loopLength).toBe(arr.length);
  });
});

describe('双向循环链表 - isEmpty 方法', () => {
  let val;
  beforeEach(() => {
    val = chance.integer();
  });
  test('长度为 1 的链表删除后为空链表', () => {
    const a = new CircleDoublyList(val);
    a.removeHead();
    expect(a.isEmpty()).toBeTruthy();
    expect(a.loopLength).toBe(0);
  });
  test('长度为 0 的链表为空链表', () => {
    const a = new CircleDoublyList();
    expect(a.isEmpty()).toBeTruthy();
    expect(a.loopLength).toBe(0);
  });
});

describe('双向循环链表 - indexOf 方法', () => {
  let arr;
  beforeEach(() => {
    arr = chance.n(chance.integer, chance.integer({ min: 2, max: 10 }));
  });
  test('链表的 indexOf 操作等同于数组行为', () => {
    const a = new CircleDoublyList(...arr);
    const index = chance.integer({ min: 0, max: a.length - 1 });
    expect(a.indexOf(arr[index])).toBe(index);
    expect(a.indexOf(arr[a.length - 1])).toBe(a.length - 1); // 最后一个元素
    expect(a.loopLength).toBe(arr.length);
  });
  test('长度为 1 的链表', () => {
    const a = new CircleDoublyList(arr[0]);
    expect(a.indexOf(arr[1])).toBe(-1);
    expect(a.indexOf(arr[0])).toBe(0); // 第一个元素
    expect(a.loopLength).toBe(1);
  });
  test('长度为 0 的链表为空链表，应该返回 -1', () => {
    const a = new CircleDoublyList();
    const val = chance.integer();
    expect(a.indexOf(val)).toBe(-1);
    expect(a.loopLength).toBe(0);
  });
});
