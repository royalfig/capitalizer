import { AP, APA, CMS, MLA, NYT, WP, Rule } from "./lib/rules";
import verbalPhrases from "./lib/verbalPhrases";
import { capFirstLetter, isCapped } from "./utils/utils";


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
    .replace(/'\b/g, "\u2018")
    .replace(/\b'/g, "\u2019")
    .replace(/"\b/g, "\u201c")
    .replace(/\b"/g, "\u201d")
    .replace(/,"/g, ",\u201d")
    .replace(/--/g, "\u2014")
    .replace(/\b\u2018\b/g, "\u2019")
    .replace(/(\u2018)(\d\ds)/g, "\u2019$2");
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
    this.title = title.replace(verbalPhrases, (match) =>
      match.replace(/\b\w/g, (match) => match.toUpperCase())
    );
    return this;
  }

  basicHyphenFormatting(title: string) {
    this.title = title.replace(/-(\w)|:\s(\w)|\?\s(\w)/g, (match) =>
      capFirstLetter(match)
    );
    return this;
  }

  formatUS(title: string) {
    this.title = title.replace(/(t|T)he U(\.)?s(\.)?(\W|\b)/g, "$1he U$2S$3$4");
    return this;
  }

  formatCa(title: string) {
    this.title = title.replace(/ Ca?\. \d/g, (match) => match.toLowerCase());
    return this;
  }

  formatAfterEmDash(title: string, config: Rule) {
    this.title = title.replace(
      /\u2014(\w+)/g,
      (match, capture) => "\u2014" + capitalize(capture, 1, this.config, 3)
    );
    return this;
  }
}



function capitalize(
  word: string,
  position: number,
  config: Rule,
  length: number
) {
  return isCapped(word, position, config, length);

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
    capitalizedWordsArrayWithRules: any[]
  };
  rules: any[];
  capitalizedTitlesWords: string[][];
  capitalizedTitlesArray: string[];
  capitalizedTitles: string;
}

class Title {
  constructor(config: string, raw: string) {
    this.config = getConfig(config);
    this.originalTitles = raw;
    this.originalTitlesArray = this.splitLines(raw, "\n");
    this.originalTitlesWords = this.splitWords(this.originalTitlesArray, /\s/g);
    this.capitalizedObj = this.parseAndCapitalize(this.originalTitlesWords);
    this.capitalizedTitlesWords = this.capitalizedObj.capitalizedTitlesWords;
    this.capitalizedTitlesArray = this.capitalizedObj.capitalizedTitlesArray;
    this.capitalizedTitles = this.capitalizedTitlesArray.join("\n");
    this.rules = this.capitalizedObj.capitalizedWordsArrayWithRules;
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
    let capitalizedWordsArrayWithRules: any[] = [];
    const capitalizedTitlesWords = originalTitlesWords.map((arr) => {
      
      capitalizedWordsArrayWithRules = arr.map((word, i, arr) => {
        const titleLength = arr.length;
        const positionInTitle = i;
        return capitalize(word, positionInTitle, this.config, titleLength);
      });
      const capitalizedWordsArray = capitalizedWordsArrayWithRules.map(val => val.word)
      const capitalizedTitle = capitalizedWordsArray.join(" ");
      capitalizedTitlesArray.push(capitalizedTitle);
      return capitalizedWordsArray;
    });

    return { capitalizedWordsArrayWithRules, capitalizedTitlesWords, capitalizedTitlesArray };
  }
}


function initCapitalizationSequence(title: string, config: string) {
  const preparedTitle = prepareTitle(title);
  const capitalizedTitles = new Title(config, preparedTitle);
  console.dir(capitalizedTitles);
}

import { titles } from "./testCase";

const testTitles = titles.join("\n");

initCapitalizationSequence(testTitles, "CMS");

// TODO HYPHENS
// TODO
