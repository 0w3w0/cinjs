export type CSSObject = {
  [K in keyof CSSStyleDeclaration]?: string | number;
}| {
  [key: string]: CSSObject;
};

export type StyleFunc = () => CSSObject;
