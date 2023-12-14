import User from "@/app/components/User";
import { cookies } from "next/headers";
import { verifyJwtToken } from "@/app/lib/auth";
import { getUserData } from "@/app/lib/actionsSupa";

export default async function UserProfile(){
    
    const payload = await verifyJwtToken(cookies().get('AUTH_TOKEN')?.value);
    const userdataSupa = await getUserData(payload.username);

    return <User userdata={userdataSupa}/>
}