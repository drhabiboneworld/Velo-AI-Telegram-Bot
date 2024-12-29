const handleError = (error) => {
  console.error('Bot Error:', error.message);
  // Don't exit process on errors, just log them
};

module.exports = { handleError };