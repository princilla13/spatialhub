import mongoose from 'mongoose';

const abuseReportSchema = new mongoose.Schema(
  {
    reportId: { type: String, required: true, unique: true },
    reporter: { type: String, required: true },
    reporterEmail: { type: String, default: '' },
    targetUrl: { type: String, required: true },
    reason: { type: String, required: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['Pending', 'In Review', 'Resolved', 'Dismissed'], default: 'Pending' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const AbuseReport = mongoose.model('AbuseReport', abuseReportSchema);
export default AbuseReport;
