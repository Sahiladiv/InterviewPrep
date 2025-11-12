export const formatQuestionText = (text: string): string => {
  if (!text) return "";
  let formatted = text.replace(/\^(\d+)/g, "<sup>$1</sup>");
  formatted = formatted.replace(/\b(max|min|sum|xor|mod)\([^)]*\)/gi, (m) => `<code>${m}</code>`);
  formatted = formatted.replace(/<=/g, "≤").replace(/>=/g, "≥");
  return formatted;
};
