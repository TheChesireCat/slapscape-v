import { cookies } from 'next/headers'
import { verifyJwtToken } from '@/app/lib/auth';
import { getUserData } from '@/app/lib/actions';
export default async function UserPage(){

    const payload = await verifyJwtToken(cookies().get('AUTH_TOKEN')?.value);
    const userdata = await getUserData(payload.username);


    return <div>{userdata ? JSON.stringify(userdata) : 'No user data'}</div>
}