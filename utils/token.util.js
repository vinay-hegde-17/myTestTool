const fs = require('fs');
const path = require('path');

const TOKEN_CACHE = path.join(process.cwd(), '.cache', 'token.json');

function getCachedToken() {
  if (!fs.existsSync(TOKEN_CACHE)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(TOKEN_CACHE, 'utf8')).token;
}

module.exports = { getCachedToken };
