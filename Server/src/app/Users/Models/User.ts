// import mongoose, { Document, Schema } from 'mongoose';



export enum UserRole {
  Nurse = 'nurse',
  Admin = 'Admin',
  Manager = 'manager',
}


// export interface IUser extends Document {
//   username: string;
//   email: string;
//   contactNumber: string;
//   password: string;
//   role: string;
//   shiftStart: string;
//   shiftEnd: string;
//   address: string;
//   gender: string;
//   isAvailable: boolean;
//   lastUpdated: Date;
//   profilePicture?: string; // Optional field for profile picture path or URL
//   createdAt?: Date;
//   updatedAt?: Date;
//   deleted?: boolean;
//   departmentId: mongoose.Types.ObjectId
// }

// const UserSchema: Schema = new Schema<IUser>(
//   {
//     username: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     contactNumber: { type: String, required: false },
//     password: { type: String, required: true },
//     role: { type: String, enum: Object.values(UserRole),required: true },
//     shiftStart: { type: String, required: false },
//     shiftEnd: { type: String, required: false },
//     address: { type: String, required: false },
//     gender: { type: String, required: false },
//     isAvailable: { type: Boolean, default: true },
//     lastUpdated: { type: Date, default: Date.now },
//     profilePicture: { type: String }, // Added field
//     deleted: { type: Boolean, default: false },
//     departmentId: {type: Schema.Types.ObjectId,ref: 'Department',required: false}
//   },
//   {
//     timestamps: true,
//   }
// );





// export default mongoose.model<IUser>('User', UserSchema);





import mongoose, { Document, Schema } from 'mongoose';
//import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  activityLevel?: 'low' | 'moderate' | 'high';
  dietaryPreference?: 'none' | 'vegetarian' | 'vegan';
  healthGoal?: 'weight_loss' | 'weight_gain' | 'maintenance';
  bmi?: number;
  bmiCategory?: string;

  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  age: { type: Number, required: false },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  height: { type: Number, required: false },
  weight: { type: Number, required: false },
  activityLevel: { type: String, enum: ['low', 'moderate', 'high'] },
  dietaryPreference: { type: String, enum: ['none', 'vegetarian', 'vegan'] },
  healthGoal: { type: String, enum: ['weight_loss', 'weight_gain', 'maintenance'] },
  bmi: { type: Number, required: false },
  bmiCategory: { type: String, required: false },
}, { timestamps: true });



export default mongoose.model<IUser>('User', UserSchema);


