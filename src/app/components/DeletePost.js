import { deletePost } from "../lib/actionsSupa";

export default async function DeletePost({ postId }) {
  return (
    <form action={deletePost}>
      <input hidden name="post_id" defaultValue={postId} />
      <button
        type="submit"
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Delete Post
      </button>
    </form>
  );
}
