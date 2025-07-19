import mongoose, { Document, Schema } from 'mongoose';

export interface IBmiHistory extends Document {
  userId: mongoose.Types.ObjectId;
  bmi: number;
  height: number;
  weight: number;
  recordedAt?: Date;
}

const bmiHistorySchema = new Schema<IBmiHistory>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bmi: Number,
  height: Number,
  weight: Number,
  recordedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IBmiHistory>('BmiHistory', bmiHistorySchema);
