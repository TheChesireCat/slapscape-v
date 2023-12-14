import { verifyJwtToken } from "@/app/lib/auth";
import { cookies } from "next/headers";
import { getPostInfo, getPostImages } from "@/app/lib/actionsSupa";
import { redirect } from "next/navigation";
import TemporaryDrawer from "@/app/components/TemporaryDrawer";
import DeleteImage from "@/app/components/DeleteImage";
import  EditTitle from "@/app/components/EditTitle";
import EditDescription from "@/app/components/EditDescription";
import DeletePost from "@/app/components/DeletePost";

export default async function EditPostPage({ params }) {
  const post_id = params.id;
  const token = cookies().get("AUTH_TOKEN")?.value;
  const payload = token ? await verifyJwtToken(token) : null;
  const username = payload?.username;

  const postData = await getPostInfo(post_id);
  const postImages = await getPostImages(post_id);

  // allow user to delete images from post
  // edit the title and description
  // no additional images

  if (!postData[0]) {
    redirect("/404");
  }

  if (postData[0].username !== username) {
    return <p>Sorry, you don&apos;t have permission to edit this post.</p>;
  }

  //   return <p>Edit Post {JSON.stringify(params)}</p>;
  return (
    <div className="bg-gray-100 p-10 h-screen">
      <TemporaryDrawer />
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow ">
        <h2 className="text-2xl font-bold text-gray-800 p-5">Edit Post</h2>
        <div className="p-5">
           
          <div className="mb-6">
            <label
              htmlFor="postTitle"
              className="block mb-2 text-sm text-gray-600"
            >
              Title
            </label>
            <EditTitle title={postData[0].title} postId={post_id}/>
          </div>

          <div className="mb-6">
            <label
              htmlFor="postDescription"
              className="block mb-2 text-sm text-gray-600"
            >
              Description
            </label>
            <EditDescription description={postData[0].description} postId={post_id}/>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Images</h3>
            <div className="grid grid-cols-3 gap-4">
              {postImages.map((image, index) => (
                <div key={index} className="relative">
                  <DeleteImage image={image.imageUrl} postId={post_id}/>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <DeletePost postId={post_id}/>
          </div>
        </div>
      </div>
    </div>
  );
}
