import { Schema, model } from "mongoose";

const DOCUMENT_NAME = "vocabulary";
const COLLECTION_NAME = "vocabularies";

const vocabularySchema = new Schema({
  word: { type: String, required: true },
  pronounce: { type: String, required: true },
  translate: { type: String, required: true },
  example: { type: String },
  audio: { type: String }
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

const VocabularyModel = model(DOCUMENT_NAME, vocabularySchema);

export default VocabularyModel;