"use client";

import AnalyticsChart from "../../../components/AnalyticsChart";

export default function AnalyticsPage() {
  const salesData = [
    { month: "Jan", sales: 120 },
    { month: "Feb", sales: 200 },
    { month: "Mar", sales: 150 },
  ];

  const visitsData = [
    { day: "Mon", visits: 300 },
    { day: "Tue", visits: 450 },
    { day: "Wed", visits: 500 },
  ];

  return (
    <div className="min-h-screen bg-[#FFF5E1] text-[#3E2C2C] p-10">
      <h1 className="text-3xl font-bold mb-8 text-[#B76E79]">
        Admin Analytics
      </h1>

      {/* Product Sales Chart */}
      <div className="bg-[#FAF3E0] p-6 rounded-xl shadow-md border border-[#E8B4B8] mb-8">
        <AnalyticsChart title="Product Sales" data={salesData} />
      </div>

      {/* Site Visits Chart */}
      <div className="bg-[#FAF3E0] p-6 rounded-xl shadow-md border border-[#E8B4B8] mb-8">
        <AnalyticsChart title="Site Visits" data={visitsData} />
      </div>

      {/* Market Analytics placeholder */}
      <div className="bg-[#FAF3E0] p-6 rounded-xl shadow-md border border-[#E8B4B8]">
        <h2 className="text-xl font-semibold mb-2 text-[#B76E79]">
          Market Analytics
        </h2>
        <p>
          Coming soon: customer demographics, trending categories, and regional sales insights.
        </p>
      </div>
    </div>
  );
}