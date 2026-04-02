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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * AnalyticsChart Component
 * @param {string} props.title - Chart title
 * @param {Array<Object>} props.data - Chart data array with key-value pairs
 */
export default function AnalyticsChart({ title, data }) {
  const labels = data.map((item) => Object.values(item)[0]);
  const values = data.map((item) => Object.values(item)[1]);

  // ✅ Rose gold / champagne palette for bars
  const barColors = [
    "rgba(183,110,121,0.75)",
    "rgba(212,160,167,0.75)",
    "rgba(154,84,96,0.75)",
    "rgba(240,217,200,0.9)",
    "rgba(183,110,121,0.55)",
    "rgba(212,160,167,0.55)",
  ];

  const borderColors = [
    "rgba(183,110,121,1)",
    "rgba(212,160,167,1)",
    "rgba(154,84,96,1)",
    "rgba(196,128,139,1)",
    "rgba(183,110,121,0.8)",
    "rgba(212,160,167,0.8)",
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        backgroundColor: barColors,
        borderColor: borderColors,
        borderWidth: 1.5,
        borderRadius: 4,
        hoverBackgroundColor: "rgba(154,84,96,0.9)",
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
          font: { size: 12, weight: "600", family: "'Jost', sans-serif" },
          color: "#5a3e38",
          padding: 20,
          boxWidth: 14,
          boxHeight: 14,
        },
      },
      title: {
        display: false, // title rendered in JSX for better styling
      },
      tooltip: {
        backgroundColor: "rgba(44,24,16,0.92)",
        titleColor: "#f0d9c8",
        bodyColor: "#e8d8cc",
        borderColor: "rgba(183,110,121,0.4)",
        borderWidth: 1,
        padding: 12,
        titleFont: { size: 13, weight: "600", family: "'Jost', sans-serif" },
        bodyFont: { size: 12, family: "'Jost', sans-serif" },
        cornerRadius: 2,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(183,110,121,0.08)" },
        border: { dash: [4, 4], color: "transparent" },
        ticks: {
          color: "#9a7b74",
          font: { size: 11, family: "'Jost', sans-serif" },
          padding: 8,
        },
      },
      x: {
        grid: { display: false },
        border: { color: "#e8d8cc" },
        ticks: {
          color: "#9a7b74",
          font: { size: 11, family: "'Jost', sans-serif" },
          padding: 6,
        },
      },
    },
  };

  return (
    <div style={{
      background: "#ffffff",
      borderRadius: "4px",
      border: "1px solid #e8d8cc",
      padding: "24px 28px 20px",
      boxShadow: "0 2px 10px rgba(44,24,16,0.05)",
      transition: "all 0.25s",
    }}>
      <div style={{ marginBottom: "20px" }}>
        <p style={{
          fontSize: "10px",
          letterSpacing: "3px",
          color: "#b76e79",
          textTransform: "uppercase",
          fontWeight: "600",
          fontFamily: "'Jost', sans-serif",
          marginBottom: "4px",
        }}>
          Analytics
        </p>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "22px",
          fontWeight: "400",
          color: "#2c1810",
          letterSpacing: "1px",
        }}>
          {title}
        </h3>
      </div>
      <Bar data={chartData} options={options} />
    </div>
  );
}