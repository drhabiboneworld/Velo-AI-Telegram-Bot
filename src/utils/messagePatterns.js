// Patterns for detecting specific user queries
const patterns = {
  sourceCode: [
    /source code/i,
    /your code/i,
    /bot('s)? code/i,
    /github/i,
    /repository/i,
    /repo/i
  ]
};

const matchesPattern = (text, patternType) => {
  return patterns[patternType].some(pattern => pattern.test(text));
};

module.exports = {
  matchesPattern
};