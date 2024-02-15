import { StyleCache, SytleScope, parseStyle, setStyleTag } from "./core";
import { CSSObject } from "./types";
import { murmurhash3 } from "./utils";

export function styleRegister(opts: {
  componentName: string;
  tokenHash: string;
  cssObj: CSSObject;
  styleScope: SytleScope; // global: 全局样式, local: 局部样式
}) {
  const { tokenHash, cssObj, componentName, styleScope } = opts;
  // 获取className
  const className = Object.keys(cssObj)
    .map((v) => {
      if (v.startsWith(".")) return v.slice(1);
      return v;
    })
    .join(" ");
  // 生成csshash
  const hashCodeKey = `${componentName}${className}`;
  const cssHash = murmurhash3(hashCodeKey);
  const hashId = `css-${cssHash}`;
  // 获取缓存
  const cache = StyleCache.get(cssHash);
  if (!cache || cache.tokenHash !== tokenHash) {
    // 解析css
    const styleStr = parseStyle(cssObj, { hashId, styleScope });
    // 设置缓存
    StyleCache.set(cssHash, {
      className: className,
      cssHash,
      tokenHash,
    });
    // 更新style标签
    setStyleTag(cssHash, tokenHash, styleStr);
  }
  return {
    hashId,
    className,
  };
}
