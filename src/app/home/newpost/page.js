import dynamic from "next/dynamic";

const NewPostWithNoSSR = dynamic(() => import("@/app/components/NewPost"), {
    ssr: false,
  });

export default function NewPostPage() {
    return <NewPostWithNoSSR />;
}