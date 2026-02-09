import { describe, expect, it, vi } from "vitest";

import {
  debounce,
  removeFalsyValuesFromObject,
  removeKeysFromObj,
} from "./index";

describe("debounce", () => {
  vi.useFakeTimers();

  it("should debounce a function", () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    expect(func).not.toHaveBeenCalled();

    vi.runAllTimers();

    expect(func).toHaveBeenCalledTimes(1);
  });

  it("should call the function with the correct context and arguments", () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 1000);
    const context = { value: "test" };

    debouncedFunc.call(context, "arg1", "arg2");

    vi.runAllTimers();

    expect(func).toHaveBeenCalledWith("arg1", "arg2");
    expect(func.mock.instances[0]).toBe(context);
  });
});

describe("removeFalsyValuesFromObject", () => {
  it("should remove falsy values from an object", () => {
    const obj = {
      a: 1,
      // b: null,
      c: undefined,
      d: "",
      e: "test",
      f: 0,
      g: false,
    };

    const result = removeFalsyValuesFromObject(obj);

    expect(result).toEqual({
      a: 1,
      e: "test",
      f: 0,
      g: false,
    });
  });

  it("should return an empty object if all values are falsy", () => {
    const obj = {
      // a: null,
      b: undefined,
      c: "",
    };

    const result = removeFalsyValuesFromObject(obj);

    expect(result).toEqual({});
  });
});

describe("removeKeysFromObj", () => {
  it("should remove specified keys from an object", () => {
    const obj = {
      a: 1,
      b: 2,
      c: 3,
    };

    const result = removeKeysFromObj(["b", "c"], obj);

    expect(result).toEqual({
      a: 1,
    });
  });

  it("should return the same object if no keys are specified", () => {
    const obj = {
      a: 1,
      b: 2,
      c: 3,
    };

    const result = removeKeysFromObj([], obj);

    expect(result).toEqual(obj);
  });

  it("should return an empty object if all keys are removed", () => {
    const obj = {
      a: 1,
      b: 2,
      c: 3,
    };

    const result = removeKeysFromObj(["a", "b", "c"], obj);

    expect(result).toEqual({});
  });
});
