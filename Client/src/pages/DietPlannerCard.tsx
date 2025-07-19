// src/components/DietPlannerCard.tsx
import React, { useState } from "react";

export default function DietPlannerCard() {
  const [height, setHeight] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [bmi, setBmi] = useState<number | null>(null);
  const [activity, setActivity] = useState("Moderate");
  const [goal, setGoal] = useState("Maintain");
  const [planType, setPlanType] = useState("Daily");
  const [dietPlan, setDietPlan] = useState<string>("");

  const activityLevels = ["Low", "Moderate", "High"];
  const goals = ["Maintain", "Lose", "Gain"];

  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters = height / 100;
      const bmiValue = weight / (heightInMeters * heightInMeters);
      setBmi(Number(bmiValue.toFixed(1)));
    }
  };

  const generatePlan = () => {
    if (!bmi) return;

    const meals = {
      breakfast: "Oats with fruits and a boiled egg",
      lunch: "Grilled chicken, brown rice and veggies",
      dinner: "Soup, salad and sweet potato",
      snacks: "Nuts, Greek yogurt, fruits",
    };

    const plan = planType === "Daily"
      ? `Your Daily ${goal} Diet Plan (BMI: ${bmi}):
- Breakfast: ${meals.breakfast}
- Lunch: ${meals.lunch}
- Dinner: ${meals.dinner}
- Snacks: ${meals.snacks}`
      : `Your Weekly ${goal} Diet Plan (BMI: ${bmi}):
Day 1:
  - Breakfast: ${meals.breakfast}
  - Lunch: ${meals.lunch}
  - Dinner: ${meals.dinner}
  - Snacks: ${meals.snacks}
Day 2:
  - Breakfast: ${meals.breakfast}
  - Lunch: ${meals.lunch}
  - Dinner: ${meals.dinner}
  - Snacks: ${meals.snacks}
Day 3:
  - Breakfast: ${meals.breakfast}
  - Lunch: ${meals.lunch}
  - Dinner: ${meals.dinner}
  - Snacks: ${meals.snacks}
...
(Repeat for 7 days)`;

    setDietPlan(plan);
  };

  const downloadPlan = () => {
    const blob = new Blob([dietPlan], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${planType}_Diet_Plan.txt`;
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 rounded-xl shadow-xl bg-white relative">
      {/* Icon */}
      {/* <div className="absolute top-4 right-4 text-3xl">🥗</div> */}

      <h2 className="text-3xl font-bold mb-2">Personalized Diet Planner</h2>
      <p className="text-gray-500 mb-4 text-sm">Tailored to your BMI & Goals</p>

      {/* BMI Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium">Height (cm)</label>
          <input
            type="number"
            value={height || ""}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Weight (kg)</label>
          <input
            type="number"
            value={weight || ""}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      <button
        onClick={calculateBMI}
        className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Calculate BMI
      </button>

      {bmi && (
        <p className="mb-4 text-lg font-semibold text-gray-700">
          Your BMI: {bmi} (
          {bmi < 18.5
            ? "Underweight"
            : bmi < 24.9
            ? "Normal"
            : bmi < 29.9
            ? "Overweight"
            : "Obese"}
          )
        </p>
      )}

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium">Activity Level</label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {activityLevels.map((level) => (
              <option key={level}>{level}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Goal</label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {goals.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Plan Type</label>
          <select
            value={planType}
            onChange={(e) => setPlanType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
          </select>
        </div>
      </div>

      <button
        onClick={generatePlan}
        className="w-full mt-4 bg-black text-white py-2 rounded hover:bg-gray-800 transition"
      >
        Generate {planType} Plan
      </button>

      {dietPlan && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow-sm">
          <h3 className="font-bold mb-2 text-xl">Your {planType} Plan</h3>
          <pre className="text-sm whitespace-pre-wrap">{dietPlan}</pre>
          <button
            onClick={downloadPlan}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Download Plan
          </button>
        </div>
      )}
    </div>
  );
}
