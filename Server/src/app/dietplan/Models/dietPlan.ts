import mongoose, { Document, Schema } from 'mongoose';

interface IMeal {
  items: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface IDietPlan extends Document {
  userId: mongoose.Types.ObjectId;
  planDate?: Date;
  meals: {
    breakfast: IMeal;
    lunch: IMeal;
    dinner: IMeal;
    snacks: IMeal;
  };
  totalCalories?: number;
  totalProtein?: number;
  totalCarbs?: number;
  totalFats?: number;
}

const mealSchema = new Schema<IMeal>({
  items: [String],
  calories: Number,
  protein: Number,
  carbs: Number,
  fats: Number
}, { _id: false });

const dietPlanSchema = new Schema<IDietPlan>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  planDate: { type: Date, default: Date.now },
  meals: {
    breakfast: mealSchema,
    lunch: mealSchema,
    dinner: mealSchema,
    snacks: mealSchema
  },
  totalCalories: Number,
  totalProtein: Number,
  totalCarbs: Number,
  totalFats: Number
}, { timestamps: true });

export default mongoose.model<IDietPlan>('DietPlan', dietPlanSchema);
