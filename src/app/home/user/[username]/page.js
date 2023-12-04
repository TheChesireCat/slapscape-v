import { getUserData } from "@/app/lib/actions";
import { CardContent, Typography } from "@mui/material";

export default async function UserProfile({ params }) {
  const userdata = await getUserData(params.username);

  if (userdata[0].result){
    return (
      <div>
        User Doesn't Exist
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-center items-center h-screen bg-gray-100">
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
