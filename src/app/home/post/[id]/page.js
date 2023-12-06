// export default function ViewPostPage({post_id}){

// get post info,
// get post images
// get post tags
// get post comments
// get post likes

import * as React from "react";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import {
  getPostImages,
  getPostInfo,
  getPostLiked,
  getPostTags,
  getTotalLikes,
} from "@/app/lib/actions";
import { Comment } from "@mui/icons-material";
import { Heart } from "lucide-react";
import { cookies } from "next/headers";
import { verifyJwtToken } from "@/app/lib/auth";
import AddLike from "@/app/components/AddLike";
import { redirect } from "next/navigation";

export default async function PostPage({ params }) {
  // console.log("id", params.id);
  const post_id = params.id;

  const token = cookies().get("AUTH_TOKEN")?.value;
  const payload = token ? await verifyJwtToken(token) : null;
  const username = payload?.username;
  //   const postData = await getPostData(post_id);

  //   if (postData[0].result) {
  //     return (
  //       <div>
  //         Post Doesn't Exist
  //       </div>
  //     );
  //   }

  //   const title = postData[0].title;
  //   const description = postData[0].description;
  //   const ursername = postData[0].username;
  //   const lat = postData[0].lat;
  //   const lng = postData[0].lng;
  //   const user_img = postData[0].user_img;
  //   const tagList = await getPostTags(post_id);

  const postData = await getPostInfo(post_id);

  if (!postData[0]) {
    redirect("/404");
  }
  
  // console.log(postData[0]);

  const postImages = await getPostImages(post_id);
  // console.log(postImages);

  const postLikedResult = await getPostLiked(post_id, username);
  const isLiked = postLikedResult.result;

  const tags = await getPostTags(post_id);
  // console.log(tags);

  const likeCount = await getTotalLikes(post_id);

  return (
    <div className="bg-gray-100">
      {/* <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="max-w-sm w-full lg:max-w-full lg:flex m-4 mx-auto ">
       */}
      <div className="rounded-t-lg border-gray-400 p-10 flex justify-center h-screen sm:h-full md:h-screen overflow-y-auto">
        <div className="max-w-md w-full lg:max-w-full lg:flex m-8 justify-center">
          <div
            className="flex-none bg-cover rounded-t text-center overflow-hidden lg:w-1/2 lg:h-full"
            title={postData[0].title}
          >
            <Box className="h-full w-full" sx={{ overflowY: "scroll" }}>
              <ImageList variant="masonry" cols={3} gap={8}>
                {postImages.map((item) => (
                  <ImageListItem key={item.imageUrl}>
                    <img
                      style={{ maxWidth: "500px", maxHeight: "500px" }}
                      srcSet={item.imageUrl}
                      src={item.imageUrl}
                      alt={item.title}
                      loading="lazy"
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
          </div>

          <div className="lg:w-1/2 lg:h-full border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
            <div className="mb-8">
              <div>
                <div className="mb-2">
                  {tags.map((tag) => (
                    <div key={tag.tag} className="text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-blue-200 text-blue-700 rounded-full">
                      {tag.tag}
                    </div>
                  ))}
                  {/* ))
                  <div className="text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-blue-200 text-blue-700 rounded-full">
                    Tag
                  </div>

                  <div className="ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-green-200 text-green-700 rounded-full">
                    Tag
                  </div>

                  <div className="ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-orange-200 text-orange-700 rounded-full">
                    Tag
                  </div>

                  <div className="ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-red-200 text-red-700 rounded-full">
                    Tag
                  </div>

                  <div className="ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 rounded-full bg-white text-gray-700 border">
                    Tag
                  </div> */}
                </div>
              </div>
              <div className="text-gray-900 font-bold text-xl mb-2 w-full">
                {postData[0].title}
              </div>
              <p className="text-gray-700 text-base">
                {postData[0].description}
              </p>
              <div className="comments-section mb-4 mt-2">
                <h2 className="text-gray-900 font-bold mb-2">Comments</h2>
                <div className="comment-list h-50 lg:h-50 md:h-50 overflow-y-scroll">
                  {/* Placeholder for comment items */}
                  <div className="comment-item border-t border-gray-200 pt-2">
                    <p className="text-sm text-gray-600">Username</p>
                    <p className="text-gray-700">
                      This is a sample comment to show the structure.
                    </p>
                  </div>

                  <div className="comment-item border-t border-gray-200 pt-2">
                    <p className="text-sm text-gray-600">Username</p>
                    <p className="text-gray-700">
                      This is a sample comment to show the structure.
                    </p>
                  </div>
                  <div className="comment-item border-t border-gray-200 pt-2">
                    <p className="text-sm text-gray-600">Username</p>
                    <p className="text-gray-700">
                      This is a sample comment to show the structure.
                    </p>
                  </div>
                  <div className="comment-item border-t border-gray-200 pt-2">
                    <p className="text-sm text-gray-600">Username</p>
                    <p className="text-gray-700">
                      This is a sample comment to show the structure.
                    </p>
                  </div>

                  {/* Repeat the above div for each comment */}
                </div>
                <div className="m-8 flex justify-center items-center">
                  <form className="w-full">
                    <div className="input-shadow h-20 w-full py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                      <label className="sr-only">Your comment</label>
                      <textarea
                        id="comment"
                        className="w-full h-full px-0 text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                        placeholder="Write a comment..."
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="bg-purple-500 border hover:bg-purple-700 text-white py-2 px-4 rounded-xl m-2 input-shadow"
                    >
                      Comment <Comment className="ml-2" />
                    </button>
                  </form>
                </div>
              </div>
              <div
                id="user-info-post-bottom"
                className="flex items-center mt-auto"
              >
                <AddLike
                  likeCount={likeCount.total_likes}
                  isLiked={isLiked}
                  postId={post_id}
                  username={username}
                />
                <img
                  className="w-10 h-10 rounded-full mr-4 border border-purple-700 p-1"
                  src={postData[0].user_img}
                  alt={postData[0].username}
                />
                <div className="text-sm">
                  <p className="text-gray-900 leading-none">
                    {postData[0].username}
                  </p>
                  <p className="text-gray-600">{postData[0].date_str}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
