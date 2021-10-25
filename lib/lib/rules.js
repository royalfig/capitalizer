"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WP = exports.NYT = exports.MLA = exports.CMS = exports.APA = exports.AP = void 0;
const allCaps_1 = __importDefault(require("./allCaps"));
const articles_1 = __importDefault(require("./articles"));
const coordinatingConjunctions_1 = __importDefault(require("./coordinatingConjunctions"));
const lowerCasePartOfNames_1 = __importDefault(require("./lowerCasePartOfNames"));
const prepositions_1 = __importDefault(require("./prepositions"));
const species_1 = __importDefault(require("./species"));
const subordinatingConjunctions_1 = __importDefault(require("./subordinatingConjunctions"));
const cmsSpecialWords_1 = __importDefault(require("./cmsSpecialWords"));
const nytSpecialWords_1 = require("./nytSpecialWords");
const AP = {
    allCaps: allCaps_1.default,
    alwaysLower: [
        ...prepositions_1.default,
        ...articles_1.default,
        ...coordinatingConjunctions_1.default,
        ...subordinatingConjunctions_1.default,
        ...lowerCasePartOfNames_1.default,
        ...species_1.default,
    ],
    alwaysLowerLength: 4,
    alwaysUpper: [],
    hyphen: null,
    name: "Associated Press",
    abbreviation: "AP",
};
exports.AP = AP;
const APA = {
    allCaps: allCaps_1.default,
    alwaysLower: [
        ...prepositions_1.default,
        ...articles_1.default,
        ...coordinatingConjunctions_1.default,
        ...subordinatingConjunctions_1.default,
        ...lowerCasePartOfNames_1.default,
        ...species_1.default,
    ],
    alwaysLowerLength: 4,
    alwaysUpper: [],
    hyphen: null,
    name: "American Psychological Association",
    abbreviation: "APA",
};
exports.APA = APA;
const CMS = {
    allCaps: allCaps_1.default,
    alwaysLower: [
        ...cmsSpecialWords_1.default,
        ...articles_1.default,
        ...prepositions_1.default,
        ...lowerCasePartOfNames_1.default,
        ...species_1.default,
    ],
    alwaysLowerLength: null,
    alwaysUpper: [],
    hyphen: null,
    name: "Chicago Manual of Style",
    abbreviation: "CMS",
};
exports.CMS = CMS;
const MLA = {
    allCaps: allCaps_1.default,
    alwaysLower: [
        ...articles_1.default,
        ...prepositions_1.default,
        ...coordinatingConjunctions_1.default,
        ...lowerCasePartOfNames_1.default,
        ...species_1.default,
    ],
    alwaysLowerLength: null,
    alwaysUpper: [],
    hyphen: null,
    name: "Modern Language Association",
    abbreviation: "MLA",
};
exports.MLA = MLA;
const NYT = {
    allCaps: allCaps_1.default,
    alwaysLower: [
        ...nytSpecialWords_1.nytAlwaysLowerCase,
        ...articles_1.default,
        ...lowerCasePartOfNames_1.default,
        ...species_1.default,
    ],
    alwaysLowerLength: null,
    alwaysUpper: nytSpecialWords_1.nytAlwaysUpperCase,
    hyphen: null,
    name: "New York Times",
    abbreviation: "NYT",
};
exports.NYT = NYT;
const WP = {
    allCaps: allCaps_1.default,
    alwaysLower: [
        ...articles_1.default,
        ...coordinatingConjunctions_1.default,
        ...prepositions_1.default,
        ...species_1.default,
    ],
    alwaysLowerLength: 5,
    alwaysUpper: [],
    hyphen: null,
    name: "Wikipedia",
    abbreviation: "WP",
};
exports.WP = WP;
