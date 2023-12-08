import { verifyJwtToken } from "@/app/lib/auth";
import { cookies } from "next/headers";
import { getTotalPostsLikedByUser } from "@/app/lib/actions";
import LikedPosts from "@/app/components/LikedPosts";
import PaginationTags from "@/app/components/PaginationTags";
import TemporaryDrawer from "@/app/components/TemporaryDrawer";

export default async function LikedPage({ searchParams }) {
  const payload = await verifyJwtToken(cookies().get("AUTH_TOKEN")?.value);
  const username = payload?.username;
  const pageNumber = searchParams?.page || 1;
  const total = await getTotalPostsLikedByUser(username);
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
            Posts Liked By You
          </h1>
          <div className="flex justify-center w-full">
            <LikedPosts
              username={username}
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
