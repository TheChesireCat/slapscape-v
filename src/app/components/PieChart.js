import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getPostsPerTag } from "../lib/actions";


export default function PieChartPlot({pieData}){

  const colors = [
    "#8884d8",
    "#FA8072",
    "#AF69EE",
    "#3DED97",
    "#3AC7EB",
    "#F9A603",
  ];
  const data = pieData;
  return (
    <>
    <h1 className="text-l text-white font-bold text-center">Pie Chart</h1>
    <h3 className="text-xs text-white font-bold text-center">Posts by tag</h3>
      <ResponsiveContainer width="90%" height="90%">
        <PieChart>
          <Pie
            data={data}
            dataKey="total_posts"
            nameKey="tag"
            cx="50%"
            cy="50%"
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
  
}
