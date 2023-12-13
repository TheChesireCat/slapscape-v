import { getUserData, getTotalPostsByUser } from "@/app/lib/actionsSupa";
import { CardContent, Typography } from "@mui/material";
import { cookies } from "next/headers";
import { verifyJwtToken } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import TemporaryDrawer from "@/app/components/TemporaryDrawer";
import PaginationTags from "@/app/components/PaginationTags";
import UserPosts from "@/app/components/UserPosts";

export default async function UserProfile({ searchParams, params }) {
  const userdata = await getUserData(params.username);

  const token = cookies().get("AUTH_TOKEN")?.value;
  const payload = token ? await verifyJwtToken(token) : null;
  const username = payload?.username;
  const pageNumber = searchParams?.page || 1;
  const total = await getTotalPostsByUser(params.username);
  const totalPages = total.total_posts;
  const postsPerPage = 2;
  const paginationPages = Math.ceil(totalPages / postsPerPage);

  // if (username==params.username){
  //   redirect("/home/user");
  // }

  if (!userdata) {
    return <div>User Doesn&apos;t Exist</div>;
  }

  return (
    <div>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <TemporaryDrawer />
        <form className="bg-white mx-auto rounded-xl px-8 pb-8 pt-8 mb-4 shadow-lg w-full max-w-md">
          <h1 className="text-xl font-bold text-center mb-6">
            {params.username}&#39;s Profile
          </h1>
          <div id="title-new-post" className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <CardContent>
              <Typography variant="primary" color="text.primary">
                {userdata.username}
              </Typography>
            </CardContent>
          </div>

          <div className="mb-4 mx-auto">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="avatar"
            >
              Avatar
            </label>
            <img
              width="60"
              height="60"
              src={
                userdata?.user_img ||
                "https://img.icons8.com/ios-glyphs/30/user--v1.png"
              }
              alt="user--v1"
              className="rounded-full mx-auto border border-black border-spacing-1 p-1 mb-5 mt-5"
            />
          </div>
          <div id="title-new-post" className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="Bio"
            >
              Bio
            </label>
            <CardContent>
              <Typography variant="primary" color="text.primary">
                {userdata.bio}
              </Typography>
            </CardContent>
          </div>
          <div className="flex justify-center w-full" style={{ minHeight: "200px" }}>
          <UserPosts
                username={params.username}
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
        </form>
      </div>
    </div>
  );
}
