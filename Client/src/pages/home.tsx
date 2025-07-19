import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../redux/store';
import { api } from '../axios/axiosinstance';
import DietPlannerCard from './DietPlannerCard';
import { Height } from '../../node_modules/@mui/icons-material/index.d';
import { showSuccessToast } from '../utils/commonfunc/toast';

const tabs = ['Dashboard', 'BMI Calculator', 'Diet Generator', 'Nutrition Info'];

const Home = () => {
  const user = useSelector((state: RootState) => state.user);
  const [selectedTab, setSelectedTab] = useState('Dashboard');
const [bmiInput, setBmiInput] = useState({ height: '', weight: '' });
const [bmiResult, setBmiResult] = useState<number | null>(null);
const [bmiCategory, setBmiCategory] = useState<string>('');
console.log(user)

  const handleBmiCalc = async () => {
  const heightInMeters = Number(bmiInput.height) / 100;
  const weight = Number(bmiInput.weight);

  if (heightInMeters > 0 && weight > 0) {
    const bmi = +(weight / (heightInMeters * heightInMeters)).toFixed(1);
    setBmiResult(bmi);

    // Determine category
    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 24.9) category = 'Normal';
    else if (bmi < 29.9) category = 'Overweight';
    else category = 'Obese';

    setBmiCategory(category);
  } else {
    setBmiResult(null);
    setBmiCategory('');
  }


type ApiResponse = {
  status: boolean;
  message?: string;
  errors?: { msg: string; path: string }[];
};

  const req = {
    id: user._id,
    bmi: bmiResult,
    bmiCategory: bmiCategory}

     const response = await api.post<ApiResponse>('/api/user/update-user', req);
      if (!response.data) throw new Error('No response data received from server');
      console.log(response.data);
      showSuccessToast('bmi updated successfully');
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-indigo-50 p-6">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">
        Welcome, {user.username || 'User'} 🌿
      </h1>
      <p className="mb-6 text-gray-600">Track your health and personalize your diet</p>

      {/* Nav Tabs */}
      <div className="flex gap-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedTab === tab
                ? 'bg-lime-500 text-white'
                : 'bg-white text-gray-800 border border-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dynamic Sections */}
      {selectedTab === 'Dashboard' && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Today’s Meals */}
          <Card title="Today’s Meals">
            <ul className="space-y-2">
              <li>🥣 <span className="font-medium">Breakfast:</span> Oats & Banana</li>
              <li>🥗 <span className="font-medium">Lunch:</span> Grilled Paneer Salad</li>
              <li>🥜 <span className="font-medium">Dinner:</span> Veg Stir Fry with Brown Rice</li>
            </ul>
          </Card>

          {/* Nutrition Summary */}
          <Card title="Nutrition Summary">
            <Metric label="Calories" value="1500 kcal" />
            <Metric label="Protein" value="60g" />
            <Metric label="Carbs" value="180g" />
            <Metric label="Fats" value="50g" />
          </Card>

          {/* Suggestions */}
          <Card title="Suggestions">
            <ul className="list-disc pl-4 space-y-1 text-sm text-gray-700">
              <li>Add fruit snacks between meals</li>
              <li>Drink at least 3L of water</li>
              <li>Limit sugar intake today</li>
            </ul>
          </Card>

          {/* Current Plan Overview */}
          <Card title="Current Plan">
            <p className="text-sm text-gray-700 mb-2">📅 <strong>Plan Duration:</strong> 21 Days</p>
            <p className="text-sm text-gray-700 mb-2">📍 <strong>Goal:</strong> Weight Loss</p>
            <div className="mt-4">
              <label className="block text-xs text-gray-500 mb-1">Progress</label>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-lime-500 h-2 rounded-full w-[40%]" />
              </div>
              <p className="text-xs text-gray-500 mt-1">8 days completed</p>
            </div>
          </Card>

          {/* Update Personal Metrics */}
          <Card title="My Metrics">
            <div className="space-y-3 text-sm">
              <MetricRow label="Weight" value={user?.weight} />
              <MetricRow label="Height" value={user?.height}/>
              <MetricRow label="BMI" value={user?.bmi} />
              {/* <MetricRow label="Daily Calorie Goal" value="1800 kcal" editable /> */}
            </div>
          </Card>
        </section>
      )}

      {selectedTab === 'BMI Calculator' && (
        <div className='w-1/2'>
           <Card title="BMI Calculator">
          <div className="space-y-4 w-1/2">
          {user?.bmi && <p> you current bmi is {user?.bmi}</p>}
            <input
              type="number"
              placeholder="Height (cm)"
              value={bmiInput.height}
              onChange={(e) => setBmiInput({ ...bmiInput, height: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Weight (kg)"
              value={bmiInput.weight}
              onChange={(e) => setBmiInput({ ...bmiInput, weight: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleBmiCalc}
              className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-indigo-700"
            >
             {user?.bmi? 'Update BMI':"Calculate BMI"} 
            </button>
            {bmiResult && (
              <div className="text-lg font-semibold text-gray-700">
                <p>Your BMI: {bmiResult}</p>
                <p>Category: {bmiCategory}</p>
              </div>
            )}
          </div>
        </Card>
          </div>
       

      )}

      {selectedTab === 'Diet Generator' && (
        <DietPlannerCard/>
      )}

      {selectedTab === 'Nutrition Info' && (
  <Card title="Nutrition Info">
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-gray-600 uppercase">
          <tr>
            <th className="px-4 py-2">Meal</th>
            <th className="px-4 py-2">Calories</th>
            <th className="px-4 py-2">Protein (g)</th>
            <th className="px-4 py-2">Carbs (g)</th>
            <th className="px-4 py-2">Fats (g)</th>
          </tr>
        </thead>
        <tbody>
          {[
            { meal: 'Breakfast', calories: 350, protein: 15, carbs: 40, fats: 10 },
            { meal: 'Lunch', calories: 500, protein: 25, carbs: 60, fats: 15 },
            { meal: 'Dinner', calories: 450, protein: 20, carbs: 50, fats: 12 },
            { meal: 'Snacks', calories: 200, protein: 10, carbs: 20, fats: 8 },
          ].map((item, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2 font-medium">{item.meal}</td>
              <td className="px-4 py-2">{item.calories}</td>
              <td className="px-4 py-2">{item.protein}</td>
              <td className="px-4 py-2">{item.carbs}</td>
              <td className="px-4 py-2">{item.fats}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
)}

    </div>
  );
};




// ✅ Reusable Card component
const Card = ({ title, children }: { title: string; children: React.ReactNode; }) => (
  <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
);

// ✅ Reusable metric line (Nutrition Summary)
const Metric = ({ label, value }: { label: string; value: string }) => (
  <p className="text-sm text-gray-700 mb-1">
    {label}: <span className="font-semibold">{value}</span>
  </p>
);

// ✅ Editable metric row
const MetricRow = ({
  label,
  value,
  editable = false
}: {
  label: string;
  value: string;
  editable?: boolean;
}) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-700">{label}</span>
    <span className="font-medium text-gray-800">
      {value}
      {editable && <button className="ml-2 text-lime-600 text-xs underline">Edit</button>}
    </span>
  </div>
);

export default Home;
