const { getAllDocuments } = require("./documentStore");

function scoreDocument(query, text) {
  const queryWords = query
    .toLowerCase()
    .split(/\W+/)
    .filter(w => w.length > 2);

  const documentText = text.toLowerCase();

  let score = 0;

  for (const word of queryWords) {
    const matches = documentText.match(new RegExp(word, "g"));
    if (matches) {
      score += matches.length;
    }
  }

  return score;
}

async function searchDocuments(query) {
  const documents = getAllDocuments();

  if (!documents.length) {
    return [];
  }

  const scored = documents
    .map(doc => ({
      ...doc,
      score: scoreDocument(query, doc.text)
    }))
    .filter(doc => doc.score > 0);

  scored.sort((a, b) => b.score - a.score);

  const uniqueDocuments = [];
  const seen = new Set();

  for (const doc of scored) {
    if (!seen.has(doc.filename)) {
      seen.add(doc.filename);
      uniqueDocuments.push(doc);
    }

    if (uniqueDocuments.length === 5) break;
  }

  return uniqueDocuments;
}

module.exports = searchDocuments;