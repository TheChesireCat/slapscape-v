import User from "@/app/components/User";
import { cookies } from "next/headers";
import { verifyJwtToken } from "@/app/lib/auth";
import { getUserData } from "@/app/lib/actionsSupa";

export default async function UserProfile(){
    // console.log(cookies().get('AUTH_TOKEN')?.value);
    const payload = await verifyJwtToken(cookies().get('AUTH_TOKEN')?.value);
    // console.log(payload);
    const userdataSupa = await getUserData(payload.username);
    // const userdata = await getUserData(payload.username);
    // console.log(userdata);

    return <User userdata={userdataSupa}/>
}