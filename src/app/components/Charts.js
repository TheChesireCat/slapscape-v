"use client";

import PieChartPlot from "./PieChart";

const Charts = ({ pieData, totalPosts, totalUsers, totalImages }) => {
  return (
    <>
      <section className="flex my-4 px-4 gap-3">
        <div className="w-1/2 h-[300px] bg-gray-700 rounded m-auto">
          <PieChartPlot pieData={pieData} />
        </div>
      </section>

      <section className="flex my-4 px-4 gap-2">
        <div className="w-1/3 h-[250px] bg-gray-700 rounded flex justify-center items-center text-white text-lg">
          Total Posts : {totalPosts.total_posts}
        </div>
        <div className="w-1/3 h-[250px] bg-gray-700 rounded flex justify-center items-center text-white text-lg">
          Total Users : {totalUsers.total_users}
        </div>
        <div className="w-1/3 h-[250px] bg-gray-700 rounded flex justify-center items-center text-white text-lg">
          Total Images : {totalImages.total_images}
        </div>
      </section>
    </>
  );
};

export default Charts;
