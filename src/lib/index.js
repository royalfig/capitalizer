"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rules_1 = require("./lib/rules");
const verbalPhrases_1 = __importDefault(require("./lib/verbalPhrases"));
const utils_1 = require("./utils/utils");
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
        this.title = title.replace(/-(\w)|:\s(\w)|\?\s(\w)/g, (match) => (0, utils_1.capFirstLetter)(match));
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
function capitalize(word, position, config, length) {
    return (0, utils_1.isCapped)(word, position, config, length);
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
        this.rules = this.capitalizedObj.capitalizedWordsArrayWithRules;
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
        let capitalizedWordsArrayWithRules = [];
        const capitalizedTitlesWords = originalTitlesWords.map((arr) => {
            capitalizedWordsArrayWithRules = arr.map((word, i, arr) => {
                const titleLength = arr.length;
                const positionInTitle = i;
                return capitalize(word, positionInTitle, this.config, titleLength);
            });
            const capitalizedWordsArray = capitalizedWordsArrayWithRules.map(val => val.word);
            const capitalizedTitle = capitalizedWordsArray.join(" ");
            capitalizedTitlesArray.push(capitalizedTitle);
            return capitalizedWordsArray;
        });
        return { capitalizedWordsArrayWithRules, capitalizedTitlesWords, capitalizedTitlesArray };
    }
}
function initCapitalizationSequence(title, config) {
    const preparedTitle = prepareTitle(title);
    const capitalizedTitles = new Title(config, preparedTitle);
    console.dir(capitalizedTitles);
}
const testCase_1 = require("./testCase");
const testTitles = testCase_1.titles.join("\n");
initCapitalizationSequence(testTitles, "CMS");
// TODO HYPHENS
// TODO
