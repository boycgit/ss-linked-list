import { DoublyList } from '../src/index';
import * as Chance from 'chance';
const chance = new Chance();

describe('双向链表 - 构造函数', () => {
  test('默认无参，生成空链表', () => {
    const a = new DoublyList();
    expect(a.length).toBe(0);
    expect(a.head).toBeNull();
    expect(a.tail).toBeNull();
  });

  test('默认接受多个参数，生成双向链表', () => {
    const arr = chance.n(chance.integer, chance.integer({ min: 1, max: 10 }));
    const a = new DoublyList(...arr);
    expect(a.length).toBe(arr.length);
    expect(a.head).toBe(arr[0]);
    expect(a.tail).toBe(arr[arr.length - 1]);
  });
});

describe('双向链表 - 迭代器', () => {
  let a, arr;
  beforeEach(() => {
    arr = chance.n(chance.integer, chance.integer({ min: 1, max: 10 }));
    a = new DoublyList(...arr);
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
    expect(b).toBeInstanceOf(DoublyList);
  });
});

describe('双向链表 - get 方法', () => {
  let a, arr;
  beforeEach(() => {
    arr = chance.n(chance.integer, chance.integer({ min: 1, max: 10 }));
    a = new DoublyList(...arr);
  });
  test('获取指定位置的元素', () => {
    var index = chance.integer({ min: 0, max: arr.length - 1 });
    expect(a.get(index)).toBe(arr[index]);
  });

  test('访问超过范围的元素时候将报错', () => {
    var len = arr.length;
    var index = chance.pickone([
      chance.integer({ min: -len, max: -1 }),
      chance.integer({ min: len, max: len * 2 })
    ]);
    expect(() => {
      a.get(index);
    }).toThrowError();
  });

  test('访问空链表的时候也报错', () => {
    const emptyList = new DoublyList();
    const index = chance.integer({ min: 0, max: 10 });
    expect(() => {
      emptyList.get(index);
    }).toThrowError();
  });
});

describe('双向链表 - append 方法', () => {
  let a, arr;
  beforeEach(() => {
    arr = chance.n(chance.integer, chance.integer({ min: 1, max: 10 }));
    a = new DoublyList(...arr);
  });
  test('在链表末尾新增元素', () => {
    const newValue = chance.integer();
    const prevLength = a.length;
    const prevHeadValue = a.head;
    a.append(newValue);
    expect(a.head).toBe(prevHeadValue);
    expect(a.tail).toBe(newValue);
    expect(a.length).toBe(prevLength + 1);
  });

  test('给空链表新增 1 个元素', () => {
    const b = new DoublyList();
    const newValue = chance.integer();
    const prevLength = b.length;
    b.append(newValue);
    expect(b.head).toBe(newValue);
    expect(b.tail).toBe(newValue);
    expect(b.length).toBe(prevLength + 1);
  });
});

describe('双向链表 - prepend 方法', () => {
  let a, arr;
  beforeEach(() => {
    arr = chance.n(chance.integer, chance.integer({ min: 1, max: 10 }));
    a = new DoublyList(...arr);
  });
  test('在链表头部新增元素', () => {
    const newValue = chance.integer();
    const prevLength = a.length;
    const prevTailValue = a.tail;
    a.prepend(newValue);
    expect(a.head).toBe(newValue);
    expect(a.tail).toBe(prevTailValue);
    expect(a.length).toBe(prevLength + 1);
  });
  test('给空链表头部新增 1 个元素', () => {
    const b = new DoublyList();
    const newValue = chance.integer();
    const prevLength = b.length;
    b.prepend(newValue);
    expect(b.head).toBe(newValue);
    expect(b.tail).toBe(newValue);
    expect(b.length).toBe(prevLength + 1);
  });
});

describe('双向链表 - remove 方法', () => {
  let a, arr;
  beforeEach(() => {
    arr = chance.n(chance.integer, chance.integer({ min: 1, max: 10 }));
    a = new DoublyList(...arr);
  });
  test('在链表中删除指定元素', () => {
    const index = chance.integer({ min: 1, max: arr.length - 1 });
    const targetValue = arr[index];
    const prevLength = a.length;
    expect(a.remove(targetValue)).toBe(targetValue);
    expect(a.length).toBe(prevLength - 1);
  });
  test('当只有 1 个元素时，删除后变成空列表', () => {
    const b = new DoublyList(arr[0]);
    expect(b.remove(arr[0])).toBe(arr[0]);
    expect(b.head).toBeNull();
    expect(b.tail).toBeNull();
  });
});

describe('双向链表 - removeHead 方法', () => {
  let a, arr;
  beforeEach(() => {
    arr = chance.n(chance.integer, chance.integer({ min: 1, max: 10 }));
    a = new DoublyList(...arr);
  });
  test('在链表中删除头部元素', () => {
    const prevLength = a.length;
    expect(a.removeHead()).toBe(arr[0]);
    expect(a.length).toBe(prevLength - 1);
  });
  test('当只有 1 个元素时，删除头部元素后变成空列表', () => {
    const b = new DoublyList(arr[0]);
    expect(b.removeHead()).toBe(arr[0]);
    expect(b.head).toBeNull();
    expect(b.tail).toBeNull();
  });
  test('当没有元素时，删除头部元素将直接返回 undefinded', () => {
    const b = new DoublyList();
    expect(b.removeHead()).toBeUndefined();
    expect(b.head).toBeNull();
    expect(b.tail).toBeNull();
  });
});

describe('双向链表 - removeTail 方法', () => {
  let a, arr;
  beforeEach(() => {
    arr = chance.n(chance.integer, chance.integer({ min: 1, max: 10 }));
    a = new DoublyList(...arr);
  });
  test('在链表中删除尾部元素', () => {
    const prevLength = a.length;
    expect(a.removeTail()).toBe(arr[arr.length - 1]);
    expect(a.length).toBe(prevLength - 1);
  });
  test('当只有 1 个元素时，删除尾部元素后变成空列表', () => {
    const b = new DoublyList(arr[0]);
    expect(b.removeTail()).toBe(arr[0]);
    expect(b.head).toBeNull();
    expect(b.tail).toBeNull();
  });
  test('当没有元素时，删除尾部元素将直接返回 undefinded', () => {
    const b = new DoublyList();
    expect(b.removeTail()).toBeUndefined();
    expect(b.head).toBeNull();
    expect(b.tail).toBeNull();
  });
});

describe('双向链表 - first 方法', () => {
  let a, arr;
  beforeEach(() => {
    arr = chance.n(chance.integer, chance.integer({ min: 1, max: 10 }));
    a = new DoublyList(...arr);
  });
  test('在链表中获取前 n 个数据', () => {
    const n = chance.integer({ min: 0, max: arr.length - 1 });
    expect(a.first(n)).toEqual(arr.slice(0, n));
  });
  test('超过自身长度，返回全部的数据', () => {
    const n = chance.integer({ min: arr.length, max: arr.length * 2 });
    expect(a.first(n)).toEqual(arr);
  });
  test('参数 num 必须大于 0 ', () => {
    const n = chance.integer({ min: -arr.length, max: -1 });
    expect(() => {
      a.first(n);
    }).toThrowError();
  });
});

describe('双向链表 - reverse 方法', () => {
  let arr;
  beforeEach(() => {
    arr = chance.n(chance.integer, chance.integer({ min: 1, max: 10 }));
  });
  test('对列表进行反转操作', () => {
    const a = new DoublyList(...arr);
    a.reverse();
    expect([...a]).toEqual([...arr.reverse()]);
  });
});
