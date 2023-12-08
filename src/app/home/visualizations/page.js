import Charts from "@/app/components/Charts";
import TemporaryDrawer from "@/app/components/TemporaryDrawer";
import {
  getPostsPerTag,
  getTotalPosts,
  getTotalUsers,
  getTotalImages,
} from "@/app/lib/actions";
export default async function VisualizationsPage() {
  const result = await getPostsPerTag();
  const totalPostsResult = await getTotalPosts();
  const totalUsersResult = await getTotalUsers();
  const totalImagesResult = await getTotalImages();

  // console.log(totalImagesResult);
  // console.log(result);

  return (
    <div>
      <TemporaryDrawer />
      <Charts pieData={result} totalPosts={totalPostsResult} totalUsers={totalUsersResult} totalImages={totalImagesResult}/>
    </div>
  );
}
