const { API_TOKEN } = require("./../config");

function validateToken(req, res, next) {
  let headerToken = req.headers.authorization;
  let bookApiKeyToken = req.headers["book-api-key"];
  let queryToken = req.query.apiKey;

  if (headerToken && headerToken !== `Bearer ${API_TOKEN}`) {
    res.statusMessage = "The 'autorization' token doesn't matches.";
    return res.status(401).end();
  } else if (bookApiKeyToken && bookApiKeyToken !== API_TOKEN) {
    res.statusMessage = "The 'autorization' token doesn't matches.";
    return res.status(401).end();
  } else if (queryToken && queryToken !== API_TOKEN) {
    res.statusMessage = "The 'autorization' token doesn't matches.";
    return res.status(401).end();
  } else if (!headerToken && !bookApiKeyToken && !queryToken) {
    res.statusMessage = "You must send the 'autorization' token.";
    return res.status(401).end();
  }

  next();
}

module.exports = validateToken;
