const escapeHtml = (text) => {
  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return text.replace(/[&<>"']/g, char => htmlEntities[char]);
};

const formatResponse = (text) => {
  // First escape HTML in the raw text
  let formattedText = escapeHtml(text);
  
  // Replace code blocks
  formattedText = formattedText.replace(
    /```(\w*)\n([\s\S]*?)```/g, 
    (_, language, code) => `<pre><code>${code.trim()}</code></pre>`
  );
  
  // Replace inline code
  formattedText = formattedText.replace(
    /`([^`]+)`/g,
    (_, code) => `<code>${code}</code>`
  );
  
  // Replace bold text
  formattedText = formattedText.replace(
    /\*\*([^*]+)\*\*/g,
    (_, text) => `<b>${text}</b>`
  );
  
  return formattedText;
};

module.exports = { formatResponse };