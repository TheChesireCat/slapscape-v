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
  getPostComments,
} from "@/app/lib/actionsSupa";
import { cookies } from "next/headers";
import { verifyJwtToken } from "@/app/lib/auth";
import AddLike from "@/app/components/AddLike";
import { redirect } from "next/navigation";
import AddComment from "@/app/components/AddComment";
import { Avatar } from "@mui/material";
import TemporaryDrawer from "@/app/components/TemporaryDrawer";
import { Edit } from "lucide-react";

export default async function PostPage({ params }) {
  // console.log("id", params.id);
  const post_id = params.id;

  const token = cookies().get("AUTH_TOKEN")?.value;
  const payload = token ? await verifyJwtToken(token) : null;
  const username = payload?.username;

  const postData = await getPostInfo(post_id);

  // console.log(postData);

  if (!postData[0]) {
    redirect("/404");
  }

  const user_img = postData[0].user_img;

  const isOwner = postData[0].username === username;

  // console.log(postData[0]);

  const postImages = await getPostImages(post_id);
  // console.log(postImages);

  const postLikedResult = await getPostLiked(post_id, username);
  const isLiked = postLikedResult[0].result;
  // console.log(isLiked);

  const tags = await getPostTags(post_id);
  // console.log(tags);

  const likeCount = await getTotalLikes(post_id);

  const comments = await getPostComments(post_id);
  // console.log(comments);

  return (
    <div className="bg-gray-100">
      <div className="rounded-t-lg border-gray-400 p-10 flex justify-center h-screen sm:h-full md:h-screen overflow-y-auto">
        <div className="max-w-md w-full lg:max-w-full lg:flex m-8 justify-center">
          <div
            className="flex-none bg-cover rounded-t text-center overflow-hidden lg:w-1/2 lg:h-full"
            title={postData[0].title}
          >
            <Box className="h-full w-full" sx={{ overflowY: "scroll" }}>
              <ImageList variant="masonry" cols={3} gap={8}>
                {postImages.map((item) => (
                  <ImageListItem key={item.imageurl}>
                    <img
                      style={{ maxWidth: "500px", maxHeight: "500px" }}
                      srcSet={item.imageurl}
                      src={item.imageurl}
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
                    <div
                      key={tag.tag}
                      className="text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-blue-200 text-blue-700 rounded-full"
                    >
                      <a href={`/home/tag/${tag.tag}`}>{tag.tag}</a>
                    </div>
                  ))}
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
                  {comments.map((comment, i) => (
                    <div
                      key={i}
                      className="flex comment-item border-t border-gray-200 pt-2"
                    >
                      <div className="flex w-10 h-10 mr-4 justify-items-center">
                        <a href={`/home/user/${comment.username}`}>
                          {" "}
                          <Avatar
                            className="border border-grey-200"
                            src={comment.user_img}
                          />
                        </a>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          {comment.date_str}
                        </p>
                        <p className="text-sm text-gray-600">
                          <a href={`/home/user/${comment.username}`}>
                            {comment.username}
                          </a>
                        </p>
                        <p className="text-gray-700">{comment.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <AddComment postId={post_id} username={username} />
              </div>

              <div
                id="user-info-post-bottom"
                className="flex items-center mt-auto"
              >
                {isOwner && (
                  <a href={`/home/post/${post_id}/edit/`}>
                    <button
                      type="button"
                      className="h-10 text-purple-700 border border-purple-700 hover:bg-purple-700 hover:text-purple-200 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:border-purple-500 dark:text-purple-500 dark:hover:text-white dark:focus:ring-purple-800 dark:hover:bg-purple-500"
                    >
                      Edit
                      <Edit className="ml-2" color="#8b5cf6" />
                    </button>
                  </a>
                )}

                <AddLike
                  likeCount={likeCount.total_likes}
                  isLiked={isLiked}
                  postId={post_id}
                  username={username}
                />
                <a href={`/home/user/${postData[0].username}`}>
                  <img
                    className="w-10 h-10 rounded-full mr-4 border border-purple-700 p-1"
                    src={user_img || "https://img.icons8.com/ios-filled/50/remove-user-male.png"}
                    alt={postData[0].username}
                  />
                </a>

                <div className="text-sm">
                  <p className="text-gray-900 leading-none">
                    {postData[0].username || "Deleted User"}
                  </p>
                  <p className="text-gray-600">{postData[0].date_str}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <TemporaryDrawer />
      </div>
    </div>
  );
}
