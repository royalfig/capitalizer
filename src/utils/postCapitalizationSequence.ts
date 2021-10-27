import { Rule, verbalPhrases } from '../lib';
import { capFirstLetter, capitalize } from '.';

export interface postCapitalizationSequence {
  title: string;
  config: Rule;
}

export class postCapitalizationSequence {
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

  //   formatAfterEmDash(title: string, config: Rule) {
  //     this.title = title.replace(/\u2014(\w+)/g, (match, capture) => '\u2014' + capitalize(capture, 1, config, 3));
  //     return this;
  //   }
}
