"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCapped = exports.capFirstLetter = void 0;
const getRule_1 = require("./getRule");
function isFirstWord(position) {
    return position === 0 ? true : false;
}
function isLastWord(position, length) {
    return position + 1 === length ? true : false;
}
function removePunctuation(word) {
    return word.replace(/[.,:;'"?!{}#&%$*^\u2018\u2019\u201c\u201d]|\[|\]/g, "");
}
function compareWords(original, capitalizedWord) {
    if (original === capitalizedWord)
        return capitalizedWord;
    const dxArray = Array.from(original).map((letter, idx) => {
        return letter === capitalizedWord[idx]
            ? capitalizedWord[idx]
            : `<span class="has-changed">${capitalizedWord[idx]}</span>`;
    });
    return dxArray.join("");
}
function followsLengthRule(config, word) {
    return config.alwaysLowerLength === null
        ? true
        : word.length < config.alwaysLowerLength;
}
function configIncludesWord(config, word) {
    return config.includes(word);
}
function capFirstLetter(word) {
    return word.replace(/\w/, (match) => match.toUpperCase());
}
exports.capFirstLetter = capFirstLetter;
function isCapped(word, position, config, length) {
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
            rule: (0, getRule_1.getRule)(0, firstLetterCapped),
            dx: compareWords(word, firstLetterCapped),
        };
    if (isLastWord(position, length))
        return {
            original: word,
            word: firstLetterCapped,
            rule: (0, getRule_1.getRule)(1, firstLetterCapped),
            dx: compareWords(word, firstLetterCapped),
        };
    if (configIncludesWord(config.allCaps, uppercase)) {
        return {
            original: word,
            word: uppercase,
            rule: (0, getRule_1.getRule)(2, uppercase),
            dx: compareWords(word, uppercase),
        };
    }
    if (configIncludesWord(config.alwaysUpper, lowercase)) {
        return {
            original: word,
            word: firstLetterCapped,
            rule: (0, getRule_1.getRule)(3, firstLetterCapped),
            dx: compareWords(word, firstLetterCapped),
        };
    }
    if (!followsLengthRule(config, lowercase))
        return {
            original: word,
            word: firstLetterCapped,
            rule: (0, getRule_1.getRule)(4, firstLetterCapped),
            dx: compareWords(word, firstLetterCapped),
        };
    if (configIncludesWord(config.alwaysLower, lowercase))
        return {
            original: word,
            word: lowercase,
            rule: (0, getRule_1.getRule)(5, lowercase),
            dx: compareWords(word, lowercase),
        };
    return {
        original: word,
        word: firstLetterCapped,
        rule: (0, getRule_1.getRule)(6, firstLetterCapped),
        dx: compareWords(word, firstLetterCapped),
    };
}
exports.isCapped = isCapped;
