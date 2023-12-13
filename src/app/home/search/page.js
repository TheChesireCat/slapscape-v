import { getTotalPostsByQuery } from "@/app/lib/actionsSupa";
import PaginationTags from "@/app/components/PaginationTags";
import QueryPosts from "@/app/components/QueryPosts";
import TemporaryDrawer from "@/app/components/TemporaryDrawer";

export default async function SearchPage({ searchParams }) {
  const query = searchParams?.q;
  const pageNumber = searchParams?.page || 1;
  const total = await getTotalPostsByQuery(query);
  const totalPages = total.total_posts;
  const postsPerPage = 2;
//   console.log(totalPages);
  const paginationPages = Math.ceil(totalPages / postsPerPage);
  return (
    <div>
      <div className="flex justify-center items-center h-screen bg-gray-100">
      <TemporaryDrawer/>
        <div
          className="input-shadow flex flex-col justify-between rounded-lg border-gray-400 bg-white m-8 p-4 w-full max-w-4xl"
          style={{ minHeight: "500px" }}
        >
          <h1 className="text-l font-bold text-center mb-6">
            Posts with text :{" "} &quot;{query}&quot;, in the title or description
          </h1>
          <div className="flex justify-center w-full">
            <QueryPosts
              query={query}
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
