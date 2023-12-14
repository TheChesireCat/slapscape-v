import { getTotalPostsWithTag } from "@/app/lib/actionsSupa";
import PaginationTags from "@/app/components/PaginationTags";
import TagPosts from "@/app/components/TagPosts";
import TemporaryDrawer from "@/app/components/TemporaryDrawer";
export default async function TagPostPage({ searchParams, params }) {
  const pageNumber = searchParams?.page || 1;
  const total = await getTotalPostsWithTag(params.id);
  const totalPages = total.total_posts;
  const postsPerPage = 2;
  const paginationPages = Math.ceil(totalPages / postsPerPage);
  return (
    <div>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <TemporaryDrawer/>
        <div
          className="input-shadow flex flex-col justify-between rounded-lg border-gray-400 bg-white m-8 p-4 w-full max-w-4xl"
          style={{ minHeight: "500px" }}
        >
          <h1 className="text-xl font-bold text-center mb-6">
            Posts with tag :{" "}
            <div
              key={params.id}
              className="text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-blue-200 text-blue-700 rounded-full"
            >
              {params.id}
            </div>
          </h1>
          <div className="flex justify-center w-full">
            <TagPosts
              tag={params.id}
              pageNumber={pageNumber}
              postsPerPage={postsPerPage}
            />
          </div>
          <div className="flex justify-center mt-4">
            <PaginationTags
              pageNumber={pageNumber}
              totalPages={paginationPages}
              postsPerPage={postsPerPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
