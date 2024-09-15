export function camelToSnake(camelString: string): string {
  return camelString.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}
