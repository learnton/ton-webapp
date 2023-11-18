const digits = new RegExp("(\\d.*)");
const letters = new RegExp("([a-zA-Z].*)");
const symbols = new RegExp(
  "([`~\\!@#\\$%\\^\\&\\*\\(\\)\\-_\\=\\+\\[\\{\\}\\]\\\\|;:\\'\",<.>\\/\\?€£¥₹§±].*)"
);

export function checkPasswordSecurityLevel(password: string): number {
  const passwordLength = password.length;

  if (passwordLength < 8) return 0;

  const includeDigits = digits.test(password);
  const includeLetters = letters.test(password);
  const includeSymbols = symbols.test(password);

  let level = 0;

  if (includeDigits) level++;
  if (includeLetters) level++;
  if (includeSymbols) level++;

  return level;
}
