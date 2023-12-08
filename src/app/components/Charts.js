'use client'

import PieChartPlot from "./PieChart";

const Charts = ({pieData}) => {
  return (
    <>
      <section className="flex my-4 px-4 gap-3">
        <div className="w-1/2 h-[300px] bg-gray-700 rounded">
            <PieChartPlot pieData={pieData}/>
        </div>

        <div className="w-1/2 h-[300px] bg-gray-700 rounded"></div>
      </section>

      <section className="flex my-4 px-4 gap-2">
        <div className=" w-1/3 h-[250px] bg-gray-700 rounded"></div>
        <div className=" w-1/3 h-[250px] bg-gray-700 rounded"></div>
        <div className=" w-1/3 h-[250px] bg-gray-700 rounded"></div>
      </section>
    </  >
  );
};

export default Charts;