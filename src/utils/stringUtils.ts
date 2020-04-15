export function splitOnUppercase(string: string): string[] {
  return string.split(/(?=[A-Z])/);
}
