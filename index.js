"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rules_1 = require("./lib/rules");
const verbalPhrases_1 = __importDefault(require("./lib/verbalPhrases"));
const getRule_1 = require("./utils/getRule");
// Configuration | Takes the desired style and sets that styles rules
const configs = new Map();
(function initConfigs() {
    for (let style of [rules_1.AP, rules_1.APA, rules_1.CMS, rules_1.MLA, rules_1.NYT, rules_1.WP]) {
        configs.set(style.abbreviation, style);
    }
})();
function getConfig(style) {
    return configs.get(style);
}
function prepareTitle(input) {
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
function capFirstLetter(word) {
    return word.replace(/\w/, (match) => match.toUpperCase());
}
function removePunctuation(word) {
    return word.replace(/[.,:;'"?!{}#&%$*^\u2018\u2019\u201c\u201d]|\[|\]/g, "");
}
class postCapitalizationSequence {
    constructor(config) {
        this.title;
        this.config = config;
    }
    formatVerbalPhrases(title) {
        this.title = title.replace(verbalPhrases_1.default, (match) => match.replace(/\b\w/g, (match) => match.toUpperCase()));
        return this;
    }
    basicHyphenFormatting(title) {
        this.title = title.replace(/-(\w)|:\s(\w)|\?\s(\w)/g, (match) => capFirstLetter(match));
        return this;
    }
    formatUS(title) {
        this.title = title.replace(/(t|T)he U(\.)?s(\.)?(\W|\b)/g, "$1he U$2S$3$4");
        return this;
    }
    formatCa(title) {
        this.title = title.replace(/ Ca?\. \d/g, (match) => match.toLowerCase());
        return this;
    }
    formatAfterEmDash(title, config) {
        this.title = title.replace(/\u2014(\w+)/g, (match, capture) => "\u2014" + capitalize(capture, 1, this.config, 3));
        return this;
    }
}
function isCapped(word, position, config, length) {
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
        return { word: firstLetterCapped, rule: getRule_1.getRule(0, firstLetterCapped) };
    if (isLastWord(position, length))
        return { word: firstLetterCapped, rule: getRule_1.getRule(1, firstLetterCapped) };
    if (configIncludesWord(config.allCaps, uppercase)) {
        return { word: uppercase, rule: getRule_1.getRule(2, uppercase) };
    }
    if (configIncludesWord(config.alwaysUpper, lowercase)) {
        return { word: firstLetterCapped, rule: getRule_1.getRule(3, firstLetterCapped) };
    }
    if (!followsLengthRule(config, lowercase))
        return { word: firstLetterCapped, rule: getRule_1.getRule(4, firstLetterCapped) };
    if (configIncludesWord(config.alwaysLower, lowercase))
        return { word: lowercase, rule: getRule_1.getRule(5, lowercase) };
    return { word: firstLetterCapped, rule: getRule_1.getRule(6, firstLetterCapped) };
}
function followsLengthRule(config, word) {
    return config.alwaysLowerLength === null
        ? true
        : word.length < config.alwaysLowerLength;
}
function configIncludesWord(config, word) {
    return config.includes(word);
}
function isFirstWord(position) {
    return position === 0 ? true : false;
}
function isLastWord(position, length) {
    return position + 1 === length ? true : false;
}
function capitalize(word, position, config, length) {
    const capitalizedWord = isCapped(word, position, config, length);
    console.log(capitalizedWord);
    return capitalizedWord.word;
}
class Title {
    constructor(config, raw) {
        this.config = getConfig(config);
        this.originalTitles = raw;
        this.originalTitlesArray = this.splitLines(raw, "\n");
        this.originalTitlesWords = this.splitWords(this.originalTitlesArray, /\s/g);
        this.capitalizedObj = this.parseAndCapitalize(this.originalTitlesWords);
        this.capitalizedTitlesWords = this.capitalizedObj.capitalizedTitlesWords;
        this.capitalizedTitlesArray = this.capitalizedObj.capitalizedTitlesArray;
        this.capitalizedTitles = this.capitalizedTitlesArray.join("\n");
        this.numberOfTitles = this.originalTitlesArray.length;
    }
    splitLines(titles, delimiter) {
        return titles.split(delimiter) || [titles];
    }
    splitWords(titles, delimiter) {
        return titles.map((title) => title.split(delimiter));
    }
    parseAndCapitalize(originalTitlesWords) {
        const capitalizedTitlesArray = [];
        const capitalizedTitlesWords = originalTitlesWords.map((arr) => {
            console.log("run");
            const x = arr.map((word, i, arr) => {
                const titleLength = arr.length;
                const positionInTitle = i;
                return capitalize(word, positionInTitle, this.config, titleLength);
            });
            const y = x.join(" ");
            capitalizedTitlesArray.push(y);
            console.log(x);
            return x;
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
function initCapitalizationSequence(title, config) {
    const preparedTitle = prepareTitle(title);
    const capitalizedTitles = new Title(config, preparedTitle);
    // console.log(capitalizedTitles);
}
const testCase_1 = require("./testCase");
const testTitles = testCase_1.titles.join("\n");
initCapitalizationSequence(testTitles, "CMS");
