import { Rule } from '../lib';
import { isCapped } from '.';

export function capitalize(titles: string[][], config: Rule) {
  return titles.map((title) => {
    return title.map((word: string, i, arr) => {
      const titleLength = arr.length;
      const positionInTitle = i;
      return isCapped(word, positionInTitle, config, titleLength);
    });
  });
}
