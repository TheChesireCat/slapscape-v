
import { createTag } from '@/app/lib/actions';   
import { cookies } from "next/headers";
import { verifyJwtToken } from '@/app/lib/auth';


export async function POST(request) {
    try {
      const data = await request.json();
      const { tag } = data;
  
      if (!tag) {
        return new Response(JSON.stringify({ error: 'Tag is required' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }


      const user = await verifyJwtToken(cookies().get('AUTH_TOKEN')?.value);
      const result = await createTag(tag,user.username);
      console.log('result', result);
  
      return new Response(JSON.stringify({ message: 'Tag created successfully' }), {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
}