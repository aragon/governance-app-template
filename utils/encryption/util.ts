export function concatenate(arrays: Uint8Array[]) {
  const totalLength = arrays.reduce((prev, uint8array) => prev + uint8array.byteLength, 0);

  const result = new Uint8Array(totalLength);

  let offset = 0;
  arrays.forEach((entry) => {
    result.set(entry, offset);
    offset += entry.byteLength;
  });

  return result;
}
