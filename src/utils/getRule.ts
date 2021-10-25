const rulesTemplate = (word: string) => [
  `"${word}" is capitalized because it's the first word in the title`,
  `"${word}" is capitalized because it's the last word in the title`,
  `"${word}" is in all caps because it is an acroynm`,
  `"${word}" is included in the style guide's list of always capitalized words`,
  `"${word}" is capitalized because it exceeds the style guide's length limit`,
  `"${word}" is not capitalized because it is an adjective`,
  `"${word}" is capitalized because it is a noun`,
];
export const getRule = (rule: number, word: string) => {
  return rulesTemplate(word)[rule];
};
