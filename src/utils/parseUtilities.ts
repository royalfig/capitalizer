/*
["a b c", "d e f"] => [["a", "b", "c"], ["d", "e", "f"]]
*/

export function createSubArrays(arrayOfTitles: string[], cb: (input: string) => string) {
  return arrayOfTitles.map((title) => {
    if (cb) return cb(title).split(' ');
    return title.split(' ');
  });
}
