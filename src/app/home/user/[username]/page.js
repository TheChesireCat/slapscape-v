import { getUserData } from "@/app/lib/actions";
import { CardContent, Typography } from "@mui/material";
import { cookies } from "next/headers";
import { verifyJwtToken } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import TemporaryDrawer from "@/app/components/TemporaryDrawer";

export default async function UserProfile({ params }) {
  const userdata = await getUserData(params.username);

  const token = cookies().get("AUTH_TOKEN")?.value;
  const payload = token ? await verifyJwtToken(token) : null;
  const username = payload?.username;

  // if (username==params.username){
  //   redirect("/home/user");
  // }


  if (userdata[0].result){
    return (
      <div>
        User Doesn&apos;t Exist
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-center items-center h-screen bg-gray-100">
      <TemporaryDrawer />
        <form
          className="bg-white mx-auto rounded-xl px-8 pb-8 pt-8 mb-4 shadow-lg w-full max-w-md"
        >
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
              {userdata[0].username}
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
                userdata[0]?.user_img ||
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
              {userdata[0].bio}
            </Typography>
            </CardContent>
          </div>
        </form>
        
      </div>

      {userdata ? JSON.stringify(userdata) : "No user data"}
    </div>
  );
}
