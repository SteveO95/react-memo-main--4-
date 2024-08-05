export function sanitizeValue(value) {
  const clearValue = String(value);
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };
  const reg = /[&<>"'/]/gi;
  return clearValue.trim().replace(reg, match => map[match]);
}
