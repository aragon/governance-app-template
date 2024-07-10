export function removeDuplicates<T>(arr: Array<T>, f: keyof T): Array<T> {
  return arr.filter((v, i, a) => a.findIndex((t) => t[f] === v[f]) === i);
}
