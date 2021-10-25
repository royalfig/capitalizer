import { getRule } from './getRule';
import { Rule } from '../lib/rules';

function isFirstWord(position: number) {
  return position === 0 ? true : false;
}

function isLastWord(position: number, length: number) {
  return position + 1 === length ? true : false;
}

function removePunctuation(word: string) {
  return word.replace(/[.,:;'"?!{}#&%$*^\u2018\u2019\u201c\u201d]|\[|\]/g, '');
}

function compareWords(original: string, capitalizedWord: string) {
  if (original === capitalizedWord) return capitalizedWord;

  const dxArray = Array.from(original).map((letter, idx) => {
    return letter === capitalizedWord[idx]
      ? capitalizedWord[idx]
      : `<span class="has-changed">${capitalizedWord[idx]}</span>`;
  });
  return dxArray.join('');
}

function followsLengthRule(config: Rule, word: string) {
  return config.alwaysLowerLength === null ? true : word.length < config.alwaysLowerLength;
}

function configIncludesWord(config: Rule['alwaysLower'] | Rule['alwaysUpper'] | Rule['allCaps'], word: string) {
  return config.includes(word);
}

export function capFirstLetter(word: string) {
  return word.replace(/\w/, (match) => match.toUpperCase());
}

export function isCapped(
  word: string,
  position: number,
  config: Rule,
  length: number,
): { original: string; word: string; rule: string; dx: string } {
  /* 
  This checks the following
  1. Is word included in words to always be lowercase?
  2. Does this word abide by the style's length rule?
  3. Is this word not included in the all caps list (e.g., FBI)?
  4. Is this word at the beginning of the title?
  5. Is this word at the end of the title?
   */

  const firstLetterCapped = capFirstLetter(word);
  const lowercase = word.toLowerCase();
  const uppercase = word.toUpperCase();

  if (isFirstWord(position))
    return {
      original: word,
      word: firstLetterCapped,
      rule: getRule(0, firstLetterCapped),
      dx: compareWords(word, firstLetterCapped),
    };

  if (isLastWord(position, length))
    return {
      original: word,
      word: firstLetterCapped,
      rule: getRule(1, firstLetterCapped),
      dx: compareWords(word, firstLetterCapped),
    };

  if (configIncludesWord(config.allCaps, uppercase)) {
    return {
      original: word,
      word: uppercase,
      rule: getRule(2, uppercase),
      dx: compareWords(word, uppercase),
    };
  }

  if (configIncludesWord(config.alwaysUpper, lowercase)) {
    return {
      original: word,
      word: firstLetterCapped,
      rule: getRule(3, firstLetterCapped),
      dx: compareWords(word, firstLetterCapped),
    };
  }

  if (!followsLengthRule(config, lowercase))
    return {
      original: word,
      word: firstLetterCapped,
      rule: getRule(4, firstLetterCapped),
      dx: compareWords(word, firstLetterCapped),
    };

  if (configIncludesWord(config.alwaysLower, lowercase))
    return {
      original: word,
      word: lowercase,
      rule: getRule(5, lowercase),
      dx: compareWords(word, lowercase),
    };

  return {
    original: word,
    word: firstLetterCapped,
    rule: getRule(6, firstLetterCapped),
    dx: compareWords(word, firstLetterCapped),
  };
}
