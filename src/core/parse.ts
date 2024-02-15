import { CSSObject } from "../types";
import { hyphenateClassName, hyphenateStyleName } from "../utils";


function mergeClass (...names: string[]){
  return names.filter(Boolean).join(' ');
};

function hasParent(value: string) {
  return value.includes('&');
}

function replaceParent(value: string, parent: string) {
  return value.replace(/&/g, parent);
}

export enum SytleScope {
  Global = 'global', // 全局样式
  Local = 'local', // 局部样式
}

/**
 * 解析css,TODO: 支持关键帧动画
 * @param css
 * @returns
 */
export function parseStyle(
  css: CSSObject,
  opts: {
    hashId?: string;
    styleScope?: SytleScope;
  },
): string {
  const { hashId, styleScope } = opts;
  let rootSelector = '';
  const firstRule = { selector: rootSelector, rules: css };
  const queue: Array<{ selector: string; rules: any }> = [firstRule];
  let styles: string[] = [];
  while (queue.length > 0) {
    const { selector, rules } = queue.shift()!;
    let ruleStr = '';
    for (const key in rules) {
      if (typeof rules[key] === 'object') {
        if (key.length === 0) continue; // TODO: 是否生成随机key，用于随机命名情况下
        let newKey = hyphenateClassName(key);
        if (hasParent(key)) {
          newKey = replaceParent(newKey, selector);
        } else {
          newKey = mergeClass(selector, newKey);
        }
        queue.push({ selector: newKey, rules: rules[key] });
      } else {
        ruleStr += `${hyphenateStyleName(key)}:${rules[key]};`;
      }
    }
    if (ruleStr.length > 0) {
      styles.push(`${selector}{${ruleStr}}`);
    }
  }
  if (styleScope === SytleScope.Local) {
    styles = styles.map((style) => {
      return `:where(.${hashId})${style}`;
    })
  }
  return styles.join('');
}