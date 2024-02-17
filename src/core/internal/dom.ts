export const setStyleTag = (
  cssHash: string,
  tokenHash: string,
  style: string
) => {
  const styleTags = document.querySelectorAll(`[data-css-hash="${cssHash}"]`);
  Array.from(styleTags).forEach((styleTag) => {
    if (styleTag) {
      const th = styleTag.getAttribute("data-token-hash");
      if (th === tokenHash) {
        return;
      }
      styleTag.setAttribute("data-token-hash", tokenHash);
      styleTag.innerHTML = style;
    } else {
      const styleEl = document.createElement("style");
      styleEl.setAttribute("data-css-hash", cssHash);
      styleEl.setAttribute("data-token-hash", tokenHash);
      styleEl.setAttribute("type", "text/css");
      styleEl.innerHTML = style;
      document.head.appendChild(styleEl);
    }
  });
};
