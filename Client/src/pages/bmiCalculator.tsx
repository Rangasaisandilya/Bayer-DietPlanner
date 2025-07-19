import React, { useState } from 'react';

export default function BMICalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');
  const [recommendation, setRecommendation] = useState('');

  const calculateBMI = () => {
    if (!height || !weight) return;

    const h = height / 100;
    const b = (weight / (h * h)).toFixed(2);
    setBmi(b);

    let cat = '';
    let rec = '';

    const bmiValue = parseFloat(b);

    if (bmiValue < 18.5) {
      cat = 'Underweight';
      rec = 'Consider a nutrition-rich diet and strength training.';
    } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
      cat = 'Normal';
      rec = 'Great! Maintain a balanced diet and regular activity.';
    } else if (bmiValue >= 25 && bmiValue < 29.9) {
      cat = 'Overweight';
      rec = 'Incorporate more physical activity and healthy meals.';
    } else {
      cat = 'Obese';
      rec = 'Seek guidance from a healthcare provider for a structured plan.';
    }

    setCategory(cat);
    setRecommendation(rec);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">BMI Calculator</h2>

      <div className="space-y-4">
        <input
          type="number"
          placeholder="Height (cm)"
          className="w-full p-3 border border-gray-300 rounded"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
        <input
          type="number"
          placeholder="Weight (kg)"
          className="w-full p-3 border border-gray-300 rounded"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <button
          onClick={calculateBMI}
          className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Calculate BMI
        </button>
      </div>

      {bmi && (
        <div className="mt-6 bg-gray-100 p-4 rounded text-center">
          <p className="text-lg font-semibold">Your BMI: {bmi}</p>
          <p className="text-md text-gray-700">Category: <strong>{category}</strong></p>
          <p className="text-sm mt-2 text-gray-600 italic">Recommendation: {recommendation}</p>
        </div>
      )}
    </div>
  );
}
