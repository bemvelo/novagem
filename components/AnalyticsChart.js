"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * AnalyticsChart Component
 * @param {Object} props - Component props
 * @param {string} props.title - Chart title
 * @param {Array<Object>} props.data - Chart data array with key-value pairs
 * @returns {JSX.Element} Rendered analytics chart
 */
export default function AnalyticsChart({ title, data }) {
  // Extract labels and values dynamically
  const labels = data.map((item) => Object.values(item)[0]);
  const values = data.map((item) => Object.values(item)[1]);

  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        backgroundColor: [
          "rgba(0, 0, 0, 0.7)",
          "rgba(100, 100, 100, 0.7)",
          "rgba(50, 50, 50, 0.7)",
          "rgba(150, 150, 150, 0.7)",
          "rgba(75, 75, 75, 0.7)",
          "rgba(125, 125, 125, 0.7)",
        ],
        borderColor: [
          "rgba(0, 0, 0, 1)",
          "rgba(100, 100, 100, 1)",
          "rgba(50, 50, 50, 1)",
          "rgba(150, 150, 150, 1)",
          "rgba(75, 75, 75, 1)",
          "rgba(125, 125, 125, 1)",
        ],
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: "rgba(0, 0, 0, 0.9)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          font: { size: 14, weight: "bold" },
          color: "#1f2937",
          padding: 20,
        },
      },
      title: {
        display: true,
        text: title,
        font: { size: 18, weight: "bold" },
        color: "#000",
        padding: 20,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0, 0, 0, 0.05)" },
        ticks: { color: "#6b7280", font: { size: 12 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#6b7280", font: { size: 12 } },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-all">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-black">{title}</h3>
      </div>
      <div className="rounded-lg overflow-hidden">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}