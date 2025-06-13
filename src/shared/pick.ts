// todo - 3: Pick the filter data

export const pick = <T extends Record<string, unknown>, k extends keyof T>(
  object: T,
  keys: k[]
): Partial<T> => {
  const sendObjectFilters: Partial<T> = {};

  for (const key of keys) {
    if (object && Object.hasOwnProperty.call(object, key)) {
      sendObjectFilters[key] = object[key];
    }
  }

  //   console.log({ sendObjectFilters });
  return sendObjectFilters;
};
