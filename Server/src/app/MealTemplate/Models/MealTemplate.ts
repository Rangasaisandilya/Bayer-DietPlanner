import mongoose, { Document, Schema } from 'mongoose';

export interface IMealTemplate extends Document {
  goal: 'weight_loss' | 'weight_gain' | 'maintenance';
  dietaryPreference: 'none' | 'vegetarian' | 'vegan';
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  items: string[];
  calories: number;
  protein?: number;
  carbs?: number;
  fats?: number;
}

const mealTemplateSchema = new Schema<IMealTemplate>({
  goal: { type: String, enum: ['weight_loss', 'weight_gain', 'maintenance'], required: true },
  dietaryPreference: { type: String, enum: ['none', 'vegetarian', 'vegan'], required: true },
  mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snacks'], required: true },
  items: [String],
  calories: Number,
  protein: Number,
  carbs: Number,
  fats: Number
});

export default mongoose.model<IMealTemplate>('MealTemplate', mealTemplateSchema);

