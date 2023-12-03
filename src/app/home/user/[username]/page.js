import { getUserData } from "@/app/lib/actions";

export default async function UserProfile({ params }) {

  const userdata = await getUserData(params.username);

  return <div>{userdata ? JSON.stringify(userdata) : 'No user data'}</div>;
}
