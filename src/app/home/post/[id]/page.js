// export default function ViewPostPage({post_id}){

// get post info,
// get post images
// get post tags
// get post comments
// get post likes

//     return <div>View Post {post_id}</div>
// }

import * as React from "react";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { getPostImages, getPostInfo } from "@/app/lib/actions";

export default async function MasonryImageList({ params }) {
  console.log("id", params.id);
  const post_id = params.id;
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
  console.log(postData[0]);

  const postImages = await getPostImages(post_id);
  console.log(postImages);


  return (
    <div>
      {/* <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="max-w-sm w-full lg:max-w-full lg:flex m-4 mx-auto ">
       */}
      <div className="rounded-t-lg border-gray-400 p-10 flex justify-center h-screen">
        <div className="max-w-md w-full lg:max-w-full lg:flex m-8 justify-center">
          <div
            className="flex-none bg-cover rounded-t text-center overflow-hidden"
            title={postData[0].title}
          >
            <Box className="h-full w-full" sx={{ overflowY: "scroll" }}>
              <ImageList variant="masonry" cols={3} gap={8}>
                {postImages.map((item) => (
                  <ImageListItem key={item.imageUrl}>
                    <img
                      style={{ maxWidth: "auto", maxHeight: "500px" }}
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
          <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
            <div className="mb-8">
              <div className="text-gray-900 font-bold text-xl mb-2 w-full">
                {postData[0].title}
              </div>
              <p className="text-gray-700 text-base">
                {postData[0].description}
              </p>
            </div>
            <div className="flex items-center">
              <img
                className="w-10 h-10 rounded-full mr-4"
                src={postData[0].user_img}
                alt="Avatar of Jonathan Reinink"
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
  );
}
