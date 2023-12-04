import { getUserData } from "@/app/lib/actions";

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
            <label
              id="username"
              className="text-l block shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              {userdata[0].username}
            </label>
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
            <textarea
              id="bio"
              type="text"
              name="bio"
              placeholder="Enter Bio Here"
              defaultValue={userdata?.bio}
              className="block shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>
        </form>
      </div>

      {userdata ? JSON.stringify(userdata) : "No user data"}
    </div>
  );
}
