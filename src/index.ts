import { AP, APA, CMS, MLA, NYT, WP, Rule } from './lib/rules';
import verbalPhrases from './lib/verbalPhrases';
import { getRule } from './utils/getRule';

// Configuration | Takes the desired style and sets that styles rules
const configs = new Map();

(function initConfigs() {
  for (let style of [AP, APA, CMS, MLA, NYT, WP]) {
    configs.set(style.abbreviation, style);
  }
})();

function getConfig(style: string) {
  return configs.get(style);
}

function prepareTitle(input: string) {
  return input
    .replace(/'\b/g, '\u2018')
    .replace(/\b'/g, '\u2019')
    .replace(/"\b/g, '\u201c')
    .replace(/\b"/g, '\u201d')
    .replace(/,"/g, ',\u201d')
    .replace(/--/g, '\u2014')
    .replace(/\b\u2018\b/g, '\u2019')
    .replace(/(\u2018)(\d\ds)/g, '\u2019$2');
}

function capFirstLetter(word: string) {
  return word.replace(/\w/, (match) => match.toUpperCase());
}

function removePunctuation(word: string) {
  return word.replace(/[.,:;'"?!{}#&%$*^\u2018\u2019\u201c\u201d]|\[|\]/g, '');
}

interface postCapitalizationSequence {
  title: string;
  config: Rule;
}

class postCapitalizationSequence {
  constructor(config: Rule) {
    this.title;
    this.config = config;
  }

  formatVerbalPhrases(title: string) {
    this.title = title.replace(verbalPhrases, (match) => match.replace(/\b\w/g, (match) => match.toUpperCase()));
    return this;
  }

  basicHyphenFormatting(title: string) {
    this.title = title.replace(/-(\w)|:\s(\w)|\?\s(\w)/g, (match) => capFirstLetter(match));
    return this;
  }

  formatUS(title: string) {
    this.title = title.replace(/(t|T)he U(\.)?s(\.)?(\W|\b)/g, '$1he U$2S$3$4');
    return this;
  }

  formatCa(title: string) {
    this.title = title.replace(/ Ca?\. \d/g, (match) => match.toLowerCase());
    return this;
  }

  formatAfterEmDash(title: string, config: Rule) {
    this.title = title.replace(/\u2014(\w+)/g, (match, capture) => '\u2014' + capitalize(capture, 1, this.config, 3));
    return this;
  }
}

function isCapped(
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
  // if (
  //   configIncludesWord(config.alwaysLower, word) &&
  //   followsLengthRule(config, word) &&
  //   !configIncludesWord(config.allCaps, word) &&
  //   !configIncludesWord(config.alwaysUpper, word) &&
  //   !isFirstWord(position) &&
  //   !isLastWord(position, length)
  // ) {
  //   return false;
  // }
  // return true;
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

function followsLengthRule(config: Rule, word: string) {
  return config.alwaysLowerLength === null ? true : word.length < config.alwaysLowerLength;
}

function configIncludesWord(config: Rule['alwaysLower'] | Rule['alwaysUpper'] | Rule['allCaps'], word: string) {
  return config.includes(word);
}

function isFirstWord(position: number) {
  return position === 0 ? true : false;
}

function isLastWord(position: number, length: number) {
  return position + 1 === length ? true : false;
}

function capitalize(word: string, position: number, config: Rule, length: number) {
  const capitalizedWord = isCapped(word, position, config, length);
  console.log(capitalizedWord);
  return capitalizedWord.word;
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

interface Title {
  config: Rule;
  originalTitles: string;
  originalTitlesArray: string[];
  originalTitlesWords: string[][];
  numberOfTitles: number;
  capitalizedObj: {
    capitalizedTitlesWords: string[][];
    capitalizedTitlesArray: string[];
  };
  capitalizedTitlesWords: string[][];
  capitalizedTitlesArray: string[];
  capitalizedTitles: string;
}

class Title {
  constructor(config: string, raw: string) {
    this.config = getConfig(config);
    this.originalTitles = raw;
    this.originalTitlesArray = this.splitLines(raw, '\n');
    this.originalTitlesWords = this.splitWords(this.originalTitlesArray, /\s/g);
    this.capitalizedObj = this.parseAndCapitalize(this.originalTitlesWords);
    this.capitalizedTitlesWords = this.capitalizedObj.capitalizedTitlesWords;
    this.capitalizedTitlesArray = this.capitalizedObj.capitalizedTitlesArray;
    this.capitalizedTitles = this.capitalizedTitlesArray.join('\n');
    this.numberOfTitles = this.originalTitlesArray.length;
  }

  splitLines(titles: string, delimiter: string) {
    return titles.split(delimiter) || [titles];
  }

  splitWords(titles: string[], delimiter: RegExp) {
    return titles.map((title) => title.split(delimiter));
  }

  parseAndCapitalize(originalTitlesWords: string[][]) {
    const capitalizedTitlesArray: string[] = [];
    const capitalizedTitlesWords = originalTitlesWords.map((arr) => {
      const capitalizedWordsArray = arr.map((word, i, arr) => {
        const titleLength = arr.length;
        const positionInTitle = i;
        return capitalize(word, positionInTitle, this.config, titleLength);
      });

      const capitalizedTitle = capitalizedWordsArray.join(' ');
      capitalizedTitlesArray.push(capitalizedTitle);
      console.log(capitalizedWordsArray);
      return capitalizedWordsArray;
    });

    return { capitalizedTitlesWords, capitalizedTitlesArray };
  }
}

/* 

{
  originalTitles: string: "title1\ntitle2",
  originalTitlesArray: [[title1],[title2],[],[],[],[]],
  originalTitlesWords: [[[title1-word1],[title1-word2]],[[title2-word1],[title2-word2]]]
  captializedTitles: ,
  capitalizedTitlesArray,
  capitalizedTitlesWords,
  dx: [[["<span class="dx">e</span>","x"],[title1-word2]],[[title2-word1],[title2-word2]]],
  reason: [[[reason],null],[[null],[title2-word2]]],
  numberOfTitles: 24,
  amznLinks: [[]],
  covers: [[]]
}



*/
function initCapitalizationSequence(title: string, config: string) {
  const preparedTitle = prepareTitle(title);
  const capitalizedTitles = new Title(config, preparedTitle);
  // console.log(capitalizedTitles);
}

import { titles } from './testCase';

const testTitles = titles.join('\n');

initCapitalizationSequence(testTitles, 'CMS');

// TODO HYPHENS
// TODO
