export const makeStore = <T>(key: string) => {
  return ({
    get(): T[] {
      try {
        const store = localStorage.getItem(key) ?? '';
        const result = JSON.parse(store);

        if (typeof result == 'object' && Array.isArray(result))
          return result;

        return [] as T[];
      } catch (e) {
        return [] as T[];
      }
    },
    set(data: T[]): void {
      const obj = JSON.stringify(data);
      localStorage.setItem(key, obj);
    }
  });
};