const mongoose = require('mongoose');

const REPORT_TYPES = ['Appointments', 'User Activity', 'Department Usage', 'Counselor Performance'];
const DATE_RANGES = ['This Week', 'This Month', 'This Quarter', 'This Year'];

const usageReportSchema = new mongoose.Schema(
  {
    type: { type: String, enum: REPORT_TYPES, required: true },
    range: { type: String, enum: DATE_RANGES, required: true },
    totalRecords: { type: Number, default: 0 },
    summary: [{ _id: false, label: String, value: Number }],
    rows: [{ _id: false, label: String, value: Number, detail: { type: String, default: '' } }],
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Management', required: true },
  },
  { timestamps: true }
);

usageReportSchema.statics.REPORT_TYPES = REPORT_TYPES;
usageReportSchema.statics.DATE_RANGES = DATE_RANGES;

module.exports = mongoose.model('UsageReport', usageReportSchema);
