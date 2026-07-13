const fs = require("fs/promises");
const path = require("path");
const { readDocument } = require("./documentReader");

const { splitIntoChunks } = require("./chunker");

const DOCUMENTS_DIR = path.join(__dirname, "..", "documents");

let documents = [];

async function loadDocuments() {
  documents = [];

  const entries = await fs.readdir(DOCUMENTS_DIR, {
    withFileTypes: true,
  });

  const files = entries.filter(
    (entry) => entry.isFile() && !entry.name.startsWith(".")
  );

  for (const file of files) {
    const filePath = path.join(DOCUMENTS_DIR, file.name);

    const doc = await readDocument(filePath);

    if (!doc) continue;

    console.log(`Indexing ${doc.filename}...`);

    const chunks = splitIntoChunks(doc.text);

    console.log(`Created ${chunks.length} chunks`);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

   documents.push({
  filename: doc.filename,
  fileType: doc.fileType,
  chunkIndex: i,
  totalChunks: chunks.length,
  text: chunk,
});
    }
  }

  console.log(
    `Indexed ${documents.length} chunks from ${files.length} documents`
  );
}

function getAllDocuments() {
  return documents;
}

module.exports = {
  loadDocuments,
  getAllDocuments,
};