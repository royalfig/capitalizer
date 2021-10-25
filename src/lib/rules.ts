import allCaps from './allCaps';
import articles from './articles';
import coordinatingConjunctions from './coordinatingConjunctions';
import lowerCasePartofNames from './lowerCasePartOfNames';
import prepositions from './prepositions';
import species from './species';
import subordinatingConjunctions from './subordinatingConjunctions';

import cmsSpecialWords from './cmsSpecialWords';
import { nytAlwaysLowerCase, nytAlwaysUpperCase } from './nytSpecialWords';

export interface Rule {
  allCaps: string[];
  alwaysLower: string[];
  alwaysLowerLength: number | null;
  alwaysUpper: string[];
  hyphen: object | null;
  name: string;
  abbreviation: string;
}

const AP: Rule = {
  allCaps,
  alwaysLower: [
    ...prepositions,
    ...articles,
    ...coordinatingConjunctions,
    ...subordinatingConjunctions,
    ...lowerCasePartofNames,
    ...species,
  ],
  alwaysLowerLength: 4,
  alwaysUpper: [],
  hyphen: null,
  name: 'Associated Press',
  abbreviation: 'AP',
};

const APA: Rule = {
  allCaps,
  alwaysLower: [
    ...prepositions,
    ...articles,
    ...coordinatingConjunctions,
    ...subordinatingConjunctions,
    ...lowerCasePartofNames,
    ...species,
  ],
  alwaysLowerLength: 4,
  alwaysUpper: [],
  hyphen: null,
  name: 'American Psychological Association',
  abbreviation: 'APA',
};

const CMS: Rule = {
  allCaps,
  alwaysLower: [...cmsSpecialWords, ...articles, ...prepositions, ...lowerCasePartofNames, ...species],
  alwaysLowerLength: null,
  alwaysUpper: [],
  hyphen: null,
  name: 'Chicago Manual of Style',
  abbreviation: 'CMS',
};

const MLA: Rule = {
  allCaps,
  alwaysLower: [...articles, ...prepositions, ...coordinatingConjunctions, ...lowerCasePartofNames, ...species],
  alwaysLowerLength: null,
  alwaysUpper: [],
  hyphen: null,
  name: 'Modern Language Association',
  abbreviation: 'MLA',
};

const NYT: Rule = {
  allCaps,
  alwaysLower: [...nytAlwaysLowerCase, ...articles, ...lowerCasePartofNames, ...species],
  alwaysLowerLength: null,
  alwaysUpper: nytAlwaysUpperCase,
  hyphen: null,
  name: 'New York Times',
  abbreviation: 'NYT',
};

const WP: Rule = {
  allCaps,
  alwaysLower: [...articles, ...coordinatingConjunctions, ...prepositions, ...species],
  alwaysLowerLength: 5,
  alwaysUpper: [],
  hyphen: null,
  name: 'Wikipedia',
  abbreviation: 'WP',
};

export { AP, APA, CMS, MLA, NYT, WP };
