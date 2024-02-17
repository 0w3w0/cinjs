export interface CacheValue {
  className: string;
  tokenHash: string;
  cssHash: string;
}

export class StyleCache {
  private static cache: Map<string, CacheValue> = new Map();

  static get(key: string) {
    return this.cache.get(key);
  }

  static set(key: string, value: CacheValue) {
    this.cache.set(key, value);
  }
}
