module.exports = string => {
  return (
    string +
    ""
      .trim()
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\//g, "&#x2F;")
      .replace(/\\/g, "&#x5C;")
      .replace(/`/g, "&#96;")
  );
};
