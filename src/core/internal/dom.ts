export function createStyleSheet(hash: string, css: string) {
  const styleTag = document.createElement('style');
  styleTag.setAttribute('data-css-hash', hash);
  styleTag.innerHTML = css;
  document.head.appendChild(styleTag);
  return styleTag;
}

export function hasStyleSheet(hash: string) {
  return !!document.querySelector(`style[data-css-hash="${hash}"]`);
}