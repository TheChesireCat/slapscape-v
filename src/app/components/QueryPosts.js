import { getPostsByQuery } from "@/app/lib/actions";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import Link from "next/link";
export default async function TagPosts({ query, pageNumber, postsPerPage }) {
  const posts = await getPostsByQuery(query, pageNumber, postsPerPage);
  return (
    // <List sx={{ width: "100%", bgcolor: "background.paper" }}>
    //   <ListItem>
    //     <ListItemAvatar>
    //       <Avatar>
    //         <ImageIcon />
    //       </Avatar>
    //     </ListItemAvatar>
    //     <ListItemText primary="Photos" secondary="Jan 9, 2014" />
    //   </ListItem>
    // </List>
    <div className="flex w-full justify-center">
      <List>
        {posts.map((post) => (
          <ListItem key={post.post_id}>
            <Link href={`/home/user/${post.username}`}>
              <ListItemAvatar>
                <Avatar src={post.user_img} />
                <div className="text-xs">{post.username}</div>
              </ListItemAvatar>
            </Link>
            <Link href={`/home/post/${post.post_id}`}>
              <ListItemText
                className="w-full"
                primary={post.title}
                secondary={post.description}
              />
            </Link>


            <div className="text-xs">{post.date_str}</div>
            <div className="text-xs mr-2">Lat {post.lat.toFixed(3)}</div>
            <div className="text-xs">Lon {post.lon.toFixed(3)}</div>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
