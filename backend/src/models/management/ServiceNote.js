const mongoose = require('mongoose');

/**
 * A short note management attaches to a service/department on the
 * Usage Details screen (e.g. "Demand spike during exam week").
 */
const serviceNoteSchema = new mongoose.Schema(
  {
    department: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true, maxlength: 300 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Management', required: true },
    authorName: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceNote', serviceNoteSchema);
