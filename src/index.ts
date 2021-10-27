import { AP, APA, CMS, MLA, NYT, WP, Rule } from './lib/rules';
import { prepareTitle, createSubArrays, capitalize } from './utils';

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

export interface Title {
  config: Rule;
  originalTitles: string[];
  originalTitlesPreparedAndAtomized: string[][];
  capitalizedTitlesAtomized: { original: string; word: string; rule: string; dx: string }[][];
  capitalizedTitles: string[];
  changes: string[];
  rules: string[];
  numberOfTitles: number;
}

export class Title {
  constructor(config: string, raw: string[]) {
    this.config = getConfig(config);
    this.originalTitles = raw;
    this.originalTitlesPreparedAndAtomized = createSubArrays(this.originalTitles, prepareTitle);
    this.capitalizedTitlesAtomized = capitalize(this.originalTitlesPreparedAndAtomized, this.config);
    this.capitalizedTitles = this.constructCapitalizedTitles(this.capitalizedTitlesAtomized, 'word');
    this.changes = this.constructCapitalizedTitles(this.capitalizedTitlesAtomized, 'dx');
    this.rules = this.constructCapitalizedTitles(this.capitalizedTitlesAtomized, 'rule');
    this.numberOfTitles = this.originalTitlesPreparedAndAtomized.length;
  }

  constructCapitalizedTitles(
    input: { original: string; word: string; rule: string; dx: string }[][],
    returnType: string,
  ): string[] {
    return input.map((title: any[]) => {
      return title.map((word: any) => word[returnType]).join(' ');
    });
  }
}

// TODO HYPHENS

// Internal Test
import { titles } from './testCase';
