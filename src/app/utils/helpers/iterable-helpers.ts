export function* iterableRange(start: number, end: number): Iterable<number> {
  yield start;
  if (start === end) return;
  yield* iterableRange(start + 1, end);
}

export function* iterableFilledArray(count: number, fillNumber: number = 0): Iterable<number> {
  yield fillNumber;
  if (count === 0) return;
  yield* iterableFilledArray(count - 1, fillNumber);
}
