import { CSSObject, StyleFunc, StyleScope } from "../types";
import { murmurhash3 } from "../utils";
import {
  StyleCache,
  createStyleSheet,
  hasStyleSheet,
  parseCSSObject,
} from "./internal";

function createStaticStyle(
  hashId: string,
  cssObj: CSSObject,
  scope: StyleScope
) {
  if (hasStyleSheet(hashId)) return;
  createStyleSheet(hashId, parseCSSObject(hashId, cssObj, scope));
}

function createUpdateStyle(
  hashId: string,
  className: string,
  css: StyleFunc,
  scope: StyleScope
) {
  if (hasStyleSheet(hashId)) return;
  const cssString = parseCSSObject(hashId, css(), scope);
  const tag = createStyleSheet(hashId, cssString);
  StyleCache.set(hashId, {
    element: tag,
    styleFunc: css,
    scope,
    className,
    hashId,
  });
}

function createStyle(
  css: StyleFunc,
  opts: Partial<{
    key: string;
    scope: StyleScope;
    update: boolean;
  }> = {
    update: false,
  }
) {
  let { key, scope, update } = opts;
  if (!scope) scope = "local";
  const cssObj = css();
  if (!key) {
    key = `css-${murmurhash3(JSON.stringify(cssObj))}`;
  } else {
    key = `css-${murmurhash3(key)}`;
  }
  let className = "";
  for (let v in cssObj) {
    className += v.startsWith(".") ? v.slice(1) + " " : v + " ";
  }
  className = className.trim();
  if (!update) {
    createStaticStyle(key, cssObj, scope!);
  } else {
    createUpdateStyle(key, className, css, scope!);
  }
  return [key, className];
}

function updateStyle() {
  StyleCache.forEach((value, _) => {
    const style = value.styleFunc();
    const cssString = parseCSSObject(value.hashId, style, value.scope);
    value.element.innerHTML = cssString;
  });
}

export {
  createStyle,
  updateStyle,
};
