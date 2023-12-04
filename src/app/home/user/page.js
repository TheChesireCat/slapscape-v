import User from "@/app/components/User";
import { cookies } from "next/headers";
import { verifyJwtToken } from "@/app/lib/auth";
import { getUserData } from "@/app/lib/actions";

export default async function UserProfile(){

    const payload = await verifyJwtToken(cookies().get('AUTH_TOKEN')?.value);
    const userdata = await getUserData(payload.username);
    // console.log(userdata);

    return <User userdata={userdata[0]}/>
}