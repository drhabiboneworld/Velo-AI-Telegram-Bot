const handleError = (error) => {
  if (error.code === 'ETELEGRAM') {
    console.error('Telegram API Error:', error.message);
  } else {
    console.error('Bot Error:', error.message);
  }
  // Don't exit process on errors, just log them
};

module.exports = { handleError };